import { Building2, Users, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
 
const statValues = ["150+", "10+", "100%"];
const statIcons = [Building2, Users, Award];

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            {t.about.title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {t.about.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {t.about.stats.map((label, idx) => {
            const Icon = statIcons[idx];
            return (
            <div
              key={label}
              className="flex flex-col items-center text-center p-8 rounded-lg bg-background border border-border"
            >
              <Icon className="w-8 h-8 text-primary mb-4" />
              <span className="font-display text-3xl font-bold text-foreground">{statValues[idx]}</span>
              <span className="text-muted-foreground text-sm mt-1">{label}</span>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
