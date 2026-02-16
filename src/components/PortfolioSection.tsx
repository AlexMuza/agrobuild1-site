import portfolio1 from "@/assets/portfolio-1.webp";
import portfolio2 from "@/assets/portfolio-2.webp";
import portfolio3 from "@/assets/portfolio-3.webp";
import portfolio4 from "@/assets/portfolio-4.webp";
import { useLanguage } from "@/contexts/LanguageContext";

const portfolioImages = [portfolio1, portfolio2, portfolio3, portfolio4];

export default function PortfolioSection() {
  const { t } = useLanguage();

  return (
    <section id="portfolio" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-14">
          {t.portfolio.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.portfolio.projects.map((project, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-lg ${i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}`}
            >
              <img
                src={portfolioImages[i]}
                alt={project.title}
                className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-darker/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-lg font-semibold text-surface-dark-foreground">{project.title}</h3>
                <p className="text-surface-dark-foreground/60 text-sm">{project.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
