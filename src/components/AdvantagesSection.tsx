import { Lightbulb, Shield, ArrowRightLeft, Handshake } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const advantageIcons = [Lightbulb, Shield, ArrowRightLeft, Handshake];

export default function AdvantagesSection() {
  const { t } = useLanguage();

  return (
    <section id="advantages" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-14">
          {t.advantages.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {t.advantages.items.map((item, idx) => {
            const Icon = advantageIcons[idx];
            return (
            <div key={item.title} className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
