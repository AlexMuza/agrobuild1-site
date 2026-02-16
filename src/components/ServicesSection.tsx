import { PenTool, Building, Wrench, Flame } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const serviceIcons = [PenTool, Building, Wrench, Flame];

export default function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-20 bg-surface-dark">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-surface-dark-foreground text-center mb-14">
          {t.services.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.services.items.map((service, idx) => {
            const Icon = serviceIcons[idx];
            return (
            <div
              key={service.title}
              className="group p-6 rounded-lg bg-surface-darker border border-border/10 hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-surface-dark-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-surface-dark-foreground/60 text-sm leading-relaxed">{service.desc}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
