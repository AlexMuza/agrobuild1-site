import portfolio1 from "@/assets/portfolio-1.webp";
import portfolio2 from "@/assets/portfolio-2.webp";
import portfolio3 from "@/assets/portfolio-3.webp";
import portfolio4 from "@/assets/portfolio-4.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useMemo, useState } from "react";

const portfolioImages = [portfolio1, portfolio2, portfolio3, portfolio4];

type PortfolioFilterKey = "all" | "zav" | "warehouses" | "dryers";

type PortfolioSectionProps = {
  sectionId?: string;
  titleOverride?: string;
  className?: string;
  defaultFilter?: PortfolioFilterKey;
};

export default function PortfolioSection({
  sectionId = "portfolio",
  titleOverride,
  className = "",
  defaultFilter = "all",
}: PortfolioSectionProps) {
  const { t } = useLanguage();

  const filterKeys: PortfolioFilterKey[] = ["all", "zav", "warehouses", "dryers"];
  const filterLabels = t.portfolio.filters || {
    all: "All",
    zav: "ZAV",
    warehouses: "Warehouses",
    dryers: "Dryers",
  };

  const [activeFilter, setActiveFilter] = useState<PortfolioFilterKey>(defaultFilter);

  useEffect(() => {
    setActiveFilter(defaultFilter);
  }, [defaultFilter]);

  const projectsWithImages = useMemo(() => {
    return t.portfolio.projects.map((project, idx) => ({
      ...project,
      _idx: idx,
      _image: portfolioImages[idx % portfolioImages.length],
    }));
  }, [t.portfolio.projects]);

  const { projectsToRender, showFallbackNote } = useMemo(() => {
    const allProjects = projectsWithImages;
    if (activeFilter === "all") {
      return { projectsToRender: allProjects, showFallbackNote: false };
    }

    const matching = allProjects.filter((p) => Array.isArray(p.tags) && p.tags.includes(activeFilter));
    if (matching.length > 0) {
      return { projectsToRender: matching, showFallbackNote: false };
    }

    // If there are no cases for this category yet, show all as a fallback.
    return { projectsToRender: allProjects, showFallbackNote: true };
  }, [activeFilter, projectsWithImages]);

  return (
    <section id={sectionId} className={`py-20 bg-card ${className}`.trim()}>
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-14">
          {titleOverride || t.portfolio.title}
        </h2>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filterKeys.map((key) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFilter(key)}
                className={[
                  "px-4 py-2 rounded-full text-sm font-semibold transition-colors border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground/80 border-border/40 hover:text-foreground hover:border-border/70",
                ].join(" ")}
              >
                {filterLabels[key] || key}
              </button>
            );
          })}
        </div>

        {showFallbackNote && (
          <p className="text-center text-sm text-muted-foreground mb-8">
            {t.portfolio.fallbackNote || "No cases for this category yet — showing similar projects."}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsToRender.map((project, i) => (
            <div
              key={project.title || project._idx}
              className={`group relative overflow-hidden rounded-lg ${i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}`}
            >
              <img
                src={project._image}
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
