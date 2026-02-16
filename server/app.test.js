// @vitest-environment node
import request from "supertest";
import { createApp } from "./app.js";

function createDeterministicRandomInt(values) {
  let i = 0;
  return () => {
    const v = values[i] ?? values[values.length - 1];
    i += 1;
    return v;
  };
}

describe("Lead backend API", () => {
  it("issues captcha and accepts a valid lead (telegram+email mocked)", async () => {
    const sendMail = vi.fn(async () => {});
    const fetchImpl = vi.fn(async () => ({ ok: true, status: 200, text: async () => "ok" }));

    const env = {
      SERVER_PORT: "8787",
      CAPTCHA_SECRET: "test-secret",
      CAPTCHA_DISABLED: "false",
      RATE_LIMIT_MAX: "100",
      MIN_SECONDS_BETWEEN_LEADS: "30",

      TELEGRAM_BOT_TOKEN: "test-token",
      TELEGRAM_CHAT_ID: "123",

      SMTP_HOST: "smtp.test",
      SMTP_PORT: "465",
      SMTP_SECURE: "true",
      SMTP_USER: "u",
      SMTP_PASS: "p",
      SMTP_FROM: "from@test",
      SMTP_TO: "to@test",
    };

    const { app } = createApp({
      env,
      now: () => 1_700_000_000_000,
      randomInt: createDeterministicRandomInt([3, 4]),
      fetchImpl,
      createTransport: () => ({ sendMail }),
    });

    const captchaRes = await request(app).get("/api/captcha").expect(200);
    expect(captchaRes.body.ok).toBe(true);
    expect(captchaRes.body.a).toBe(3);
    expect(captchaRes.body.b).toBe(4);

    const leadRes = await request(app)
      .post("/api/lead")
      .send({
        name: "Ivan Ivanov",
        phone: "+7 (980) 248-84-85",
        comment: "Test",
        website: "",
        captchaToken: captchaRes.body.token,
        captchaAnswer: String(captchaRes.body.a + captchaRes.body.b),
      })
      .expect(200);

    expect(leadRes.body.ok).toBe(true);
    expect(leadRes.body.delivered).toEqual(expect.arrayContaining(["telegram", "email"]));
    expect(fetchImpl).toHaveBeenCalled();
    expect(sendMail).toHaveBeenCalled();
  });

  it("enforces cooldown between leads for same IP", async () => {
    const env = {
      CAPTCHA_SECRET: "test-secret",
      CAPTCHA_DISABLED: "false",
      RATE_LIMIT_MAX: "100",
      MIN_SECONDS_BETWEEN_LEADS: "30",
      TELEGRAM_BOT_TOKEN: "test-token",
      TELEGRAM_CHAT_ID: "123",
    };

    const { app } = createApp({
      env,
      now: () => 1_700_000_000_000,
      randomInt: createDeterministicRandomInt([1, 1, 1, 1]),
      fetchImpl: async () => ({ ok: true, status: 200, text: async () => "ok" }),
    });

    const captcha1 = await request(app).get("/api/captcha");
    await request(app)
      .post("/api/lead")
      .send({
        name: "Ivan Ivanov",
        phone: "+79000000000",
        comment: "",
        website: "",
        captchaToken: captcha1.body.token,
        captchaAnswer: String(captcha1.body.a + captcha1.body.b),
      })
      .expect(200);

    const captcha2 = await request(app).get("/api/captcha");
    const second = await request(app)
      .post("/api/lead")
      .send({
        name: "Ivan Ivanov",
        phone: "+79000000000",
        comment: "",
        website: "",
        captchaToken: captcha2.body.token,
        captchaAnswer: String(captcha2.body.a + captcha2.body.b),
      })
      .expect(429);

    expect(second.body.code).toBe("COOLDOWN");
  });
});

