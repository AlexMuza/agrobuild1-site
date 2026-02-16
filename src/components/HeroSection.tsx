import heroBg from "@/assets/hero-bg.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src={heroBg}
        alt={t.hero.alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[hsl(var(--hero-overlay)/0.75)]" />

      <div className="relative z-10 container mx-auto px-4 text-center py-32">
        <p className="font-display text-primary uppercase tracking-[0.25em] text-sm md:text-base mb-4 animate-fade-in-up">
          {t.hero.subtitle}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-surface-dark-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          {t.hero.titleLine1}
          <br />
          <span className="text-gradient">{t.hero.titleLine2}</span>
        </h1>
        <p className="max-w-2xl mx-auto text-surface-dark-foreground/70 text-base md:text-lg mb-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          {t.hero.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
          <a
            href="#contact"
            className="bg-primary text-primary-foreground px-8 py-3.5 rounded font-semibold text-base hover:bg-accent transition-colors"
          >
            {t.hero.leaveRequest}
          </a>
          <a
            href="#portfolio"
            className="border border-surface-dark-foreground/30 text-surface-dark-foreground px-8 py-3.5 rounded font-semibold text-base hover:border-primary hover:text-primary transition-colors"
          >
            {t.hero.projects}
          </a>
        </div>
      </div>
    </section>
  );
}
