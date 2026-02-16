import { Phone, Mail, ArrowUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-surface-darker py-12 border-t border-border/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <span className="font-display text-xl font-bold text-surface-dark-foreground">
              {language === "ru" ? "АгроСтройКомплекс" : "AgroStroyComplex"}
            </span>
            <p className="text-surface-dark-foreground/50 text-sm mt-1">
              {t.footer.slogan}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 text-sm text-surface-dark-foreground/70">
            <a href="tel:+79802488485" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="w-4 h-4" /> +7 (980) 248-84-85 — Макс
            </a>
            <a href="mailto:info@agrostroy.ru" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="w-4 h-4" /> info@agrostroy.ru
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="text-sm text-primary hover:text-accent transition-colors font-medium"
            >
              {t.footer.leaveRequest}
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-border/20 flex items-center justify-center text-surface-dark-foreground/50 hover:text-primary hover:border-primary transition-colors"
              aria-label={t.footer.backToTop}
            >
              <ArrowUp className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="text-center mt-10 text-surface-dark-foreground/30 text-xs">
          {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
