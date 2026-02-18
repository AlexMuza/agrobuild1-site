import express from "express";
import nodemailer from "nodemailer";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function createApp(options = {}) {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const createTransport = options.createTransport ?? nodemailer.createTransport.bind(nodemailer);
  const now = options.now ?? (() => Date.now());
  const randomInt = options.randomInt ?? crypto.randomInt;

  const app = express();
  app.use(express.json());

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const CAPTCHA_TTL_MS = 5 * 60 * 1000;
  const CAPTCHA_SECRET = env.CAPTCHA_SECRET || "dev-captcha-secret";
  const CAPTCHA_DISABLED = env.CAPTCHA_DISABLED === "true" || env.CAPTCHA_DISABLED === "1";

  const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
  const RATE_LIMIT_MAX = Number(env.RATE_LIMIT_MAX || 20); // per IP per window
  const rateLimitMap = new Map(); // ip -> { windowStartMs, count }

  const MIN_SECONDS_BETWEEN_LEADS = Number(env.MIN_SECONDS_BETWEEN_LEADS || 30);
  const lastLeadAtMap = new Map(); // ip -> lastLeadAtMs

  const BLACKLIST_IPS = new Set(
    String(env.BLACKLIST_IPS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  const BLACKLIST_PHONES = new Set(
    String(env.BLACKLIST_PHONES || "")
      .split(",")
      .map((s) => s.trim().replace(/\D/g, ""))
      .filter(Boolean),
  );
  const BLACKLIST_WORDS = String(env.BLACKLIST_WORDS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // Lightweight profanity filter; tune via BLACKLIST_WORDS in env.
  const DEFAULT_BAD_WORDS = ["сука", "блять", "бля", "хуй", "пизд", "еб", "fuck", "shit"];

  function parseBool(value, fallback = false) {
    if (value == null) return fallback;
    return value === "true" || value === "1";
  }

  // If you are behind a reverse proxy (Render/Railway/etc), enable trust proxy so req.ip is correct.
  // Otherwise, we avoid reading x-forwarded-for to prevent IP spoofing (rate-limit bypass).
  const TRUST_PROXY = parseBool(env.TRUST_PROXY, env.NODE_ENV === "production");
  if (TRUST_PROXY) {
    app.set("trust proxy", 1);
  }

  function isPlaceholder(value) {
    if (!value) return true;
    const normalized = value.trim().toLowerCase();
    return normalized.startsWith("your_") || normalized.includes("your-provider.com") || normalized.includes("your-domain.com");
  }

  function getOptionalEnv(name) {
    const value = env[name];
    if (!value || isPlaceholder(value)) return null;
    return value;
  }

  function requireEnv(name) {
    const value = getOptionalEnv(name);
    if (!value) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
  }

  function getClientIp(req) {
    if (TRUST_PROXY) {
      // Express computes req.ip using x-forwarded-for when trust proxy is enabled.
      return req.ip || "unknown";
    }
    return req.socket.remoteAddress || "unknown";
  }

  function rateLimitCheck(ip) {
    const ts = now();
    const existing = rateLimitMap.get(ip);
    if (!existing || ts - existing.windowStartMs > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.set(ip, { windowStartMs: ts, count: 1 });
      return { ok: true };
    }

    existing.count += 1;
    return { ok: existing.count <= RATE_LIMIT_MAX };
  }

  function cooldownCheck(ip) {
    const ts = now();
    const last = lastLeadAtMap.get(ip);
    if (!last) return { ok: true };
    const elapsedSeconds = Math.floor((ts - last) / 1000);
    const retryAfterSeconds = Math.max(0, MIN_SECONDS_BETWEEN_LEADS - elapsedSeconds);
    return { ok: retryAfterSeconds <= 0, retryAfterSeconds };
  }

  function markLead(ip) {
    lastLeadAtMap.set(ip, now());
  }

  function hmacHex(input) {
    return crypto.createHmac("sha256", CAPTCHA_SECRET).update(input).digest("hex");
  }

  function createCaptchaToken(a, b, ts) {
    const base = `${a}.${b}.${ts}`;
    const sig = hmacHex(base).slice(0, 20);
    return `${base}.${sig}`;
  }

  function verifyCaptchaToken(token, answer) {
    if (CAPTCHA_DISABLED) return { ok: true };
    if (!token || typeof token !== "string") return { ok: false };
    const parts = token.split(".");
    if (parts.length !== 4) return { ok: false };
    const [aStr, bStr, tsStr, sig] = parts;
    const a = Number(aStr);
    const b = Number(bStr);
    const ts = Number(tsStr);
    if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(ts)) return { ok: false };
    if (now() - ts > CAPTCHA_TTL_MS) return { ok: false };
    const expected = hmacHex(`${a}.${b}.${ts}`).slice(0, 20);

    const sigBuf = Buffer.from(String(sig));
    const expBuf = Buffer.from(String(expected));
    if (sigBuf.length !== expBuf.length) return { ok: false };
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return { ok: false };

    const numeric = Number(String(answer ?? "").trim());
    if (!Number.isFinite(numeric) || numeric !== a + b) return { ok: false };
    return { ok: true };
  }

  function normalizePhone(phoneRaw) {
    const digits = String(phoneRaw || "").replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("8")) return `7${digits.slice(1)}`;
    if (digits.length === 11 && digits.startsWith("7")) return digits;
    if (digits.length === 10) return `7${digits}`;
    return null;
  }

  function collapseWhitespace(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function hasLink(value) {
    return /(https?:\/\/|www\.)/i.test(String(value || ""));
  }

  function hasLongRepeat(value, threshold = 14) {
    const s = String(value || "");
    let run = 1;
    for (let i = 1; i < s.length; i += 1) {
      if (s[i] === s[i - 1]) run += 1;
      else run = 1;
      if (run >= threshold) return true;
    }
    return false;
  }

  function containsBadWords(value) {
    const text = String(value || "").toLowerCase();
    const words = DEFAULT_BAD_WORDS.concat(BLACKLIST_WORDS);
    return words.some((w) => w && text.includes(w));
  }

  function sendError(res, status, code, message, extra = {}) {
    res.status(status).json({ ok: false, code, message, ...extra });
  }

  function buildLeadMessage({ name, phone, comment }) {
    const lines = [
      "New lead from AgroStroyComplex website",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Comment: ${comment || "-"}`,
      `Created at: ${new Date(now()).toISOString()}`,
    ];
    return lines.join("\n");
  }

  async function sendToTelegram(message) {
    const botToken = requireEnv("TELEGRAM_BOT_TOKEN");
    const chatId = requireEnv("TELEGRAM_CHAT_ID");

    const response = await fetchImpl(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Telegram request failed: ${response.status} ${body}`);
    }
  }

  async function sendToEmail({ name, phone, comment }) {
    const host = requireEnv("SMTP_HOST");
    const smtpPort = Number(env.SMTP_PORT || 587);
    const user = requireEnv("SMTP_USER");
    const pass = requireEnv("SMTP_PASS");
    const from = requireEnv("SMTP_FROM");
    const to = requireEnv("SMTP_TO");
    const secure = parseBool(env.SMTP_SECURE, smtpPort === 465);

    const transporter = createTransport({
      host,
      port: smtpPort,
      secure,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to,
      subject: "Новая заявка с сайта АгроСтройКомплекс",
      text: [
        "Новая заявка с сайта АгроСтройКомплекс",
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        `Комментарий: ${comment || "-"}`,
        `Дата: ${new Date(now()).toLocaleString("ru-RU")}`,
      ].join("\n"),
    });
  }

  async function sendToMax(message) {
    const token = requireEnv("MAX_BOT_TOKEN");
    const userId = getOptionalEnv("MAX_USER_ID");
    const chatId = getOptionalEnv("MAX_CHAT_ID");
    if (!userId && !chatId) {
      throw new Error("MAX is enabled but MAX_USER_ID or MAX_CHAT_ID is missing.");
    }

    const url = new URL("https://platform-api.max.ru/messages");
    if (userId) url.searchParams.set("user_id", String(userId));
    if (chatId) url.searchParams.set("chat_id", String(chatId));
    url.searchParams.set("disable_link_preview", "true");

    const response = await fetchImpl(url.toString(), {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`MAX request failed: ${response.status} ${body}`);
    }
  }

  app.get("/api/captcha", (_req, res) => {
    if (CAPTCHA_DISABLED) {
      res.json({ ok: true, disabled: true });
      return;
    }

    const a = randomInt(1, 10);
    const b = randomInt(1, 10);
    const ts = now();
    const token = createCaptchaToken(a, b, ts);
    res.json({ ok: true, a, b, token, ttlMs: CAPTCHA_TTL_MS });
  });

  app.post("/api/lead", async (req, res) => {
    const ip = getClientIp(req);
    if (BLACKLIST_IPS.has(ip)) {
      sendError(res, 403, "BLACKLISTED", "Forbidden.");
      return;
    }

    const rl = rateLimitCheck(ip);
    if (!rl.ok) {
      sendError(res, 429, "RATE_LIMIT", "Too many requests. Please try again later.");
      return;
    }

    const cooldown = cooldownCheck(ip);
    if (!cooldown.ok) {
      sendError(res, 429, "COOLDOWN", "Please wait before sending another request.", {
        retryAfterSeconds: cooldown.retryAfterSeconds,
      });
      return;
    }

    const honeypot = String(req.body?.website || "").trim();
    if (honeypot) {
      res.json({ ok: true, delivered: [], failed: [] });
      return;
    }

    const name = collapseWhitespace(req.body?.name);
    const phoneRaw = String(req.body?.phone || "");
    const comment = collapseWhitespace(req.body?.comment).slice(0, 500);
    const captchaToken = String(req.body?.captchaToken || "");
    const captchaAnswer = req.body?.captchaAnswer;

    if (!name || !phoneRaw) {
      sendError(res, 400, "REQUIRED", "Name and phone are required.");
      return;
    }

    if (!/^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\s'-]{1,59}$/.test(name)) {
      sendError(res, 400, "NAME_INVALID", "Invalid name.");
      return;
    }

    const phoneDigits = normalizePhone(phoneRaw);
    if (!phoneDigits) {
      sendError(res, 400, "PHONE_INVALID", "Invalid phone.");
      return;
    }

    if (BLACKLIST_PHONES.has(phoneDigits)) {
      sendError(res, 403, "BLACKLISTED", "Forbidden.");
      return;
    }

    if (hasLink(comment) || hasLongRepeat(comment)) {
      sendError(res, 400, "COMMENT_INVALID", "Invalid comment.");
      return;
    }

    if (containsBadWords(name) || containsBadWords(comment)) {
      sendError(res, 400, "PROFANITY", "Invalid content.");
      return;
    }

    const captcha = verifyCaptchaToken(captchaToken, captchaAnswer);
    if (!captcha.ok) {
      sendError(res, 400, "CAPTCHA_FAILED", "Captcha failed.");
      return;
    }

    const phoneE164 = `+${phoneDigits}`;
    const message = buildLeadMessage({ name, phone: phoneE164, comment });

    const hasTelegram = Boolean(getOptionalEnv("TELEGRAM_BOT_TOKEN") && getOptionalEnv("TELEGRAM_CHAT_ID"));
    const hasEmail = Boolean(
      getOptionalEnv("SMTP_HOST") &&
        getOptionalEnv("SMTP_USER") &&
        getOptionalEnv("SMTP_PASS") &&
        getOptionalEnv("SMTP_FROM") &&
        getOptionalEnv("SMTP_TO"),
    );
    const hasMax = Boolean(getOptionalEnv("MAX_BOT_TOKEN") && (getOptionalEnv("MAX_CHAT_ID") || getOptionalEnv("MAX_USER_ID")));

    if (!hasTelegram && !hasEmail && !hasMax) {
      sendError(res, 500, "NOT_CONFIGURED", "No delivery channel configured.");
      return;
    }

    const deliveryTasks = [];
    if (hasTelegram) deliveryTasks.push({ channel: "telegram", task: sendToTelegram(message) });
    if (hasEmail) deliveryTasks.push({ channel: "email", task: sendToEmail({ name, phone: phoneE164, comment }) });
    if (hasMax) deliveryTasks.push({ channel: "max", task: sendToMax(message) });

    const settled = await Promise.allSettled(deliveryTasks.map((item) => item.task));

    const failed = [];
    const delivered = [];
    settled.forEach((result, idx) => {
      const channel = deliveryTasks[idx].channel;
      if (result.status === "fulfilled") delivered.push(channel);
      else failed.push(`${channel}: ${result.reason}`);
    });

    if (delivered.length > 0) {
      // Log partial delivery failures (e.g. telegram ok but email failed).
      if (failed.length > 0) {
        console.error("Lead delivered partially:", { delivered, failed });
      }
      markLead(ip);
      res.json({ ok: true, delivered, failed });
      return;
    }

    res.status(502).json({ ok: false, message: "Failed to deliver lead to all configured channels", details: failed });
  });

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "lead-delivery", port: Number(env.PORT || env.SERVER_PORT || 8787) });
  });

  app.get("/api/config", (req, res) => {
    const ip = getClientIp(req);
    const hasTelegram = Boolean(getOptionalEnv("TELEGRAM_BOT_TOKEN") && getOptionalEnv("TELEGRAM_CHAT_ID"));
    const hasEmail = Boolean(
      getOptionalEnv("SMTP_HOST") &&
        getOptionalEnv("SMTP_USER") &&
        getOptionalEnv("SMTP_PASS") &&
        getOptionalEnv("SMTP_FROM") &&
        getOptionalEnv("SMTP_TO"),
    );
    const hasMax = Boolean(getOptionalEnv("MAX_BOT_TOKEN") && (getOptionalEnv("MAX_CHAT_ID") || getOptionalEnv("MAX_USER_ID")));

    const missingEmail = [];
    if (!getOptionalEnv("SMTP_HOST")) missingEmail.push("SMTP_HOST");
    if (!getOptionalEnv("SMTP_USER")) missingEmail.push("SMTP_USER");
    if (!getOptionalEnv("SMTP_PASS")) missingEmail.push("SMTP_PASS");
    if (!getOptionalEnv("SMTP_FROM")) missingEmail.push("SMTP_FROM");
    if (!getOptionalEnv("SMTP_TO")) missingEmail.push("SMTP_TO");

    const missingMax = [];
    if (!getOptionalEnv("MAX_BOT_TOKEN")) missingMax.push("MAX_BOT_TOKEN");
    if (!getOptionalEnv("MAX_USER_ID") && !getOptionalEnv("MAX_CHAT_ID")) missingMax.push("MAX_USER_ID or MAX_CHAT_ID");

    res.json({
      ok: true,
      port: Number(env.PORT || env.SERVER_PORT || 8787),
      yourIp: ip,
      telegramConfigured: hasTelegram,
      emailConfigured: hasEmail,
      maxConfigured: hasMax,
      captchaDisabled: CAPTCHA_DISABLED,
      rateLimit: { windowMs: RATE_LIMIT_WINDOW_MS, max: RATE_LIMIT_MAX },
      cooldownSeconds: MIN_SECONDS_BETWEEN_LEADS,
      blacklists: {
        ips: BLACKLIST_IPS.size,
        phones: BLACKLIST_PHONES.size,
        words: BLACKLIST_WORDS.length,
      },
      missingEmail,
      missingMax,
    });
  });

  // Production: serve the built SPA from /dist and keep /api routes working.
  // Enable when NODE_ENV=production (default on most platforms) or SERVE_CLIENT=true.
  const shouldServeClient = env.NODE_ENV === "production" || env.SERVE_CLIENT === "true" || env.SERVE_CLIENT === "1";
  if (shouldServeClient) {
    const distDir = path.resolve(__dirname, "..", "dist");
    const indexHtml = path.join(distDir, "index.html");
    if (fs.existsSync(indexHtml)) {
      app.use(express.static(distDir));
      // Express 5 + path-to-regexp v6 doesn't accept "*" route patterns.
      // Regex keeps it simple and avoids swallowing /api routes.
      app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
        res.sendFile(indexHtml);
      });
    }
  }

  return { app };
}

