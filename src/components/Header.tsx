import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";

// Use absolute hash links so navigation works from any route (service pages too).
const navHrefs = ["/#about", "/#services", "/#portfolio", "/#advantages", "/#contact"];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const goToContact: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    setOpen(false);

    // If we're already on a page that contains the contact section ("/" and service pages),
    // just update hash; ScrollToHash will handle the smooth scroll.
    const hasContactOnPage = location.pathname === "/" || location.pathname.startsWith("/services/");
    const search = window.location.search || "";
    if (hasContactOnPage) {
      navigate({ pathname: location.pathname, search, hash: "#contact" });
      return;
    }

    // Otherwise, go to homepage contact.
    navigate({ pathname: "/", search, hash: "#contact" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-darker/95 backdrop-blur-md border-b border-border/10 notranslate">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded bg-primary flex items-center justify-center">
            <span className="font-display font-bold text-primary-foreground text-lg">A</span>
          </div>
          <span className="font-display text-xl font-bold text-surface-dark-foreground tracking-wide hidden sm:inline">
            {language === "ru" ? "АгроСтройКомплекс" : "AgroStroyComplex"}
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navHrefs.map((href, i) => (
            <a
              key={href}
              href={href}
              onClick={href.endsWith("#contact") ? goToContact : undefined}
              className="text-sm font-medium text-surface-dark-foreground/70 hover:text-primary transition-colors"
            >
              {t.nav[i]}
            </a>
          ))}
        </nav>

        {/* Phone + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <div className="inline-flex rounded border border-border/30 overflow-hidden">
            <button
              type="button"
              onClick={() => setLanguage("ru")}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${language === "ru" ? "bg-primary text-primary-foreground" : "text-surface-dark-foreground/70 hover:text-surface-dark-foreground"}`}
            >
              RU
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${language === "en" ? "bg-primary text-primary-foreground" : "text-surface-dark-foreground/70 hover:text-surface-dark-foreground"}`}
            >
              EN
            </button>
          </div>
          <a href="tel:+79802488485" className="flex items-center gap-2 text-surface-dark-foreground/80 text-sm">
            <Phone className="w-4 h-4 text-primary" />
            <span>+7 (980) 248-84-85</span>
          </a>
          <a
            href="/#contact"
            onClick={goToContact}
            className="bg-primary text-primary-foreground px-5 py-2 rounded text-sm font-semibold hover:bg-accent transition-colors"
          >
            {t.callBack}
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-surface-dark-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-surface-darker border-t border-border/10 px-4 pb-4">
          <nav className="flex flex-col gap-3 pt-3">
            <div className="inline-flex w-fit rounded border border-border/30 overflow-hidden mb-1">
              <button
                type="button"
                onClick={() => setLanguage("ru")}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${language === "ru" ? "bg-primary text-primary-foreground" : "text-surface-dark-foreground/70 hover:text-surface-dark-foreground"}`}
              >
                RU
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${language === "en" ? "bg-primary text-primary-foreground" : "text-surface-dark-foreground/70 hover:text-surface-dark-foreground"}`}
              >
                EN
              </button>
            </div>
            {navHrefs.map((href, i) => (
              <a
                key={href}
                href={href}
                onClick={href.endsWith("#contact") ? goToContact : () => setOpen(false)}
                className="text-surface-dark-foreground/80 hover:text-primary transition-colors text-sm font-medium"
              >
                {t.nav[i]}
              </a>
            ))}
            <a href="tel:+79802488485" className="flex items-center gap-2 text-surface-dark-foreground/80 text-sm pt-2">
              <Phone className="w-4 h-4 text-primary" />
              +7 (980) 248-84-85
            </a>
            <a
              href="/#contact"
              onClick={goToContact}
              className="bg-primary text-primary-foreground px-5 py-2 rounded text-sm font-semibold text-center hover:bg-accent transition-colors"
            >
              {t.callBack}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
