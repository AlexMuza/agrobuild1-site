import ServicePageLayout from "./ServicePageLayout";
import { Seo } from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";

export default function GrainWarehousesPage() {
  const { language } = useLanguage();

  const title =
    language === "ru"
      ? "Строительство складов зерна — под ключ | АгроСтройКомплекс"
      : "Grain storage warehouses — turnkey construction | AgroStroyComplex";

  const description =
    language === "ru"
      ? "Строительство складов для хранения зерна: проект, металлокаркас, ограждающие конструкции, монтаж. Под ключ по ЦФО."
      : "Turnkey grain storage warehouses: design, steel frame, envelope and installation across Central Russia.";

  return (
    <ServicePageLayout>
      <Seo title={title} description={description} />

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "ru" ? "Строительство складов зерна" : "Grain storage warehouses"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === "ru"
              ? "Проектируем и строим склады хранения зерна и зерновых культур: под ваши объёмы, транспортную схему и требования по эксплуатации."
              : "We design and build grain storage warehouses tailored to your volume, logistics and operational requirements."}
          </p>
        </div>
      </section>
    </ServicePageLayout>
  );
}

