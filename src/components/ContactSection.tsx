import { useEffect, useMemo, useState } from "react";
import { CreditCard, X } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatRuPhone(value: string) {
  // Accepts any input, returns formatted "+7 (999) 999-99-99" as user types.
  let digits = digitsOnly(value);
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (digits.startsWith("7")) digits = digits.slice(1);
  digits = digits.slice(0, 10);

  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 6);
  const p3 = digits.slice(6, 8);
  const p4 = digits.slice(8, 10);

  let out = "+7";
  if (p1) out += ` (${p1}`;
  if (p1.length === 3) out += ")";
  if (p2) out += ` ${p2}`;
  if (p3) out += `-${p3}`;
  if (p4) out += `-${p4}`;
  return out;
}

function normalizeRuPhone(value: string) {
  let digits = digitsOnly(value);
  if (digits.length === 11 && digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (digits.length === 10) digits = `7${digits}`;
  if (digits.length === 11 && digits.startsWith("7")) return `+${digits}`;
  return null;
}

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function hasLink(value: string) {
  return /(https?:\/\/|www\.)/i.test(value);
}

function hasLongRepeat(value: string, threshold = 14) {
  let run = 1;
  for (let i = 1; i < value.length; i += 1) {
    if (value[i] === value[i - 1]) run += 1;
    else run = 1;
    if (run >= threshold) return true;
  }
  return false;
}

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", comment: "", website: "", captchaAnswer: "" });
  const [creditOpen, setCreditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const [captcha, setCaptcha] = useState<{ token: string; a: number; b: number } | null>(null);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; comment?: string; captcha?: string }>({});

  const captchaQuestion = useMemo(() => {
    if (!captcha) return null;
    return `${captcha.a} + ${captcha.b}`;
  }, [captcha]);

  const loadCaptcha = async () => {
    try {
      const response = await fetch("/api/captcha");
      const data = await response.json();
      if (!response.ok || !data?.ok || data?.disabled) {
        throw new Error("Captcha unavailable");
      }
      setCaptcha({ token: String(data.token), a: Number(data.a), b: Number(data.b) });
    } catch (error) {
      console.error("Failed to load captcha:", error);
      setCaptcha(null);
      toast.error(t.contact.captchaLoadError);
    }
  };

  useEffect(() => {
    loadCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = collapseWhitespace(form.name).slice(0, 60);
    const phoneFormatted = form.phone;
    const phoneNormalized = normalizeRuPhone(phoneFormatted);
    const comment = collapseWhitespace(form.comment).slice(0, 500);
    const nextErrors: typeof errors = {};

    if (!name || !phoneFormatted) {
      if (!name) nextErrors.name = t.contact.nameInvalid;
      if (!phoneFormatted) nextErrors.phone = t.contact.phoneInvalid;
      setErrors(nextErrors);
      toast.error(t.contact.fillRequired);
      return;
    }
    if (!/^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\s'-]{1,59}$/.test(name)) {
      nextErrors.name = t.contact.nameInvalid;
      setErrors(nextErrors);
      toast.error(t.contact.nameInvalid);
      return;
    }
    if (!phoneNormalized) {
      nextErrors.phone = t.contact.phoneInvalid;
      setErrors(nextErrors);
      toast.error(t.contact.phoneInvalid);
      return;
    }
    if (hasLink(comment) || hasLongRepeat(comment)) {
      nextErrors.comment = t.contact.commentInvalid;
      setErrors(nextErrors);
      toast.error(t.contact.commentInvalid);
      return;
    }
    if (!captcha || !captcha.token) {
      nextErrors.captcha = t.contact.captchaLoadError;
      setErrors(nextErrors);
      toast.error(t.contact.captchaLoadError);
      return;
    }
    const captchaAnswer = digitsOnly(form.captchaAnswer);
    if (!captchaAnswer || Number(captchaAnswer) !== captcha.a + captcha.b) {
      nextErrors.captcha = t.contact.captchaInvalid;
      setErrors(nextErrors);
      toast.error(t.contact.captchaInvalid);
      await loadCaptcha();
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone: phoneNormalized,
          comment,
          website: form.website,
          captchaToken: captcha.token,
          captchaAnswer,
        }),
      });

      if (!response.ok) {
        let payload: unknown = null;
        try {
          payload = await response.json();
        } catch {
          // ignore
        }

        const maybePayload = payload as { code?: unknown; retryAfterSeconds?: unknown } | null;

        if (response.status === 429 && maybePayload?.code === "COOLDOWN") {
          const seconds = Number(maybePayload?.retryAfterSeconds || 0);
          toast.error(t.contact.cooldown.replace("{seconds}", String(seconds)));
          return;
        }
        if (response.status === 429) {
          toast.error(t.contact.tooManyRequests);
          return;
        }
        if (response.status === 403) {
          toast.error(t.contact.forbidden);
          return;
        }

        if (maybePayload?.code === "NAME_INVALID") setErrors({ name: t.contact.nameInvalid });
        if (maybePayload?.code === "PHONE_INVALID") setErrors({ phone: t.contact.phoneInvalid });
        if (maybePayload?.code === "COMMENT_INVALID" || maybePayload?.code === "PROFANITY")
          setErrors({ comment: t.contact.commentInvalid });
        if (maybePayload?.code === "CAPTCHA_FAILED") setErrors({ captcha: t.contact.captchaInvalid });

        throw new Error(`Request failed with status ${response.status}`);
      }

      // Backend may accept the request but fail to deliver via one of the channels.
      // We still show success, but surface partial delivery (e.g. email failed).
      try {
        const payload = (await response.json()) as { delivered?: unknown; failed?: unknown };
        const failed = Array.isArray(payload?.failed) ? payload.failed.map(String) : [];
        const emailFailed = failed.some((f) => f.toLowerCase().startsWith("email:"));
        if (emailFailed) {
          toast.error(t.contact.emailDeliveryFailed);
        }
      } catch {
        // ignore
      }

      toast.success(t.contact.requestSent);
      setForm({ name: "", phone: "", comment: "", website: "", captchaAnswer: "" });
      await loadCaptcha();
    } catch (error) {
      console.error("Failed to submit lead:", error);
      toast.error(t.contact.requestError);
      await loadCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-surface-dark">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-surface-dark-foreground text-center mb-14">
          {t.contact.title}
        </h2>

        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder={t.contact.namePlaceholder}
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              maxLength={60}
              className={`w-full bg-surface-darker border rounded px-4 py-3 text-surface-dark-foreground placeholder:text-surface-dark-foreground/40 focus:outline-none transition-colors ${
                errors.name ? "border-red-500 focus:border-red-500" : "border-border/20 focus:border-primary"
              }`}
            />
            {errors.name && <div className="text-red-400 text-xs">{errors.name}</div>}
            <input
              type="tel"
              inputMode="tel"
              placeholder="+7 (999) 999-99-99"
              value={form.phone}
              onChange={(e) => {
                setForm({ ...form, phone: formatRuPhone(e.target.value) });
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              maxLength={18}
              className={`w-full bg-surface-darker border rounded px-4 py-3 text-surface-dark-foreground placeholder:text-surface-dark-foreground/40 focus:outline-none transition-colors ${
                errors.phone ? "border-red-500 focus:border-red-500" : "border-border/20 focus:border-primary"
              }`}
            />
            {errors.phone && <div className="text-red-400 text-xs">{errors.phone}</div>}
            <textarea
              placeholder={t.contact.commentPlaceholder}
              value={form.comment}
              onChange={(e) => {
                setForm({ ...form, comment: e.target.value });
                if (errors.comment) setErrors((prev) => ({ ...prev, comment: undefined }));
              }}
              rows={4}
              maxLength={500}
              className={`w-full bg-surface-darker border rounded px-4 py-3 text-surface-dark-foreground placeholder:text-surface-dark-foreground/40 focus:outline-none transition-colors resize-none ${
                errors.comment ? "border-red-500 focus:border-red-500" : "border-border/20 focus:border-primary"
              }`}
            />
            {errors.comment && <div className="text-red-400 text-xs">{errors.comment}</div>}
            {/* Honeypot field (bots often fill it). Hidden from users. */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="hidden"
              aria-hidden="true"
            />

            <div className="flex items-center gap-3">
              <div className="text-surface-dark-foreground/70 text-sm">
                {t.contact.captchaLabel}:{" "}
                <span className="text-surface-dark-foreground font-semibold">{captchaQuestion ?? "..."}</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                placeholder={t.contact.captchaPlaceholder}
                value={form.captchaAnswer}
                onChange={(e) => {
                  setForm({ ...form, captchaAnswer: e.target.value });
                  if (errors.captcha) setErrors((prev) => ({ ...prev, captcha: undefined }));
                }}
                maxLength={2}
                className={`w-28 bg-surface-darker border rounded px-3 py-2 text-surface-dark-foreground placeholder:text-surface-dark-foreground/40 focus:outline-none transition-colors ${
                  errors.captcha ? "border-red-500 focus:border-red-500" : "border-border/20 focus:border-primary"
                }`}
              />
              <button
                type="button"
                onClick={loadCaptcha}
                className="text-xs text-surface-dark-foreground/70 hover:text-primary transition-colors"
              >
                ↻
              </button>
            </div>
            {errors.captcha && <div className="text-red-400 text-xs">{errors.captcha}</div>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded font-semibold hover:bg-accent transition-colors"
            >
              {isSubmitting ? t.contact.sending : t.contact.submit}
            </button>
          </form>

          <button
            onClick={() => setCreditOpen(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 border border-primary/50 text-primary py-3.5 rounded font-semibold hover:bg-primary/10 transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            {t.contact.creditButton}
          </button>
        </div>
      </div>

      {/* Credit Modal */}
      {creditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-darker/80 backdrop-blur-sm p-4">
          <div className="bg-card rounded-lg p-8 max-w-md w-full relative">
            <button
              onClick={() => setCreditOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              aria-label={t.contact.close}
            >
              <X className="w-5 h-5" />
            </button>
            <CreditCard className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground mb-3">
              {t.contact.creditTitle}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {t.contact.creditDescription}
            </p>
            <a
              href="#contact"
              onClick={() => setCreditOpen(false)}
              className="block text-center bg-primary text-primary-foreground py-3 rounded font-semibold hover:bg-accent transition-colors"
            >
              {t.contact.title}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
