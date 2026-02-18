import ServicePageLayout from "./ServicePageLayout";
import { Seo } from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DesignPage() {
  const { language } = useLanguage();

  const title =
    language === "ru"
      ? "Проектирование агрообъектов — ЗАВ, зерносушилки, склады | АгроСтройКомплекс"
      : "Engineering for agro facilities — grain complexes, dryers, warehouses | AgroStroyComplex";

  const description =
    language === "ru"
      ? "Проектирование агрообъектов: технологические схемы, компоновка, привязка на площадке. Подготовим решения под ваше ТЗ."
      : "Engineering for agro facilities: process flows, layout, site adaptation. We prepare solutions for your requirements.";

  return (
    <ServicePageLayout>
      <Seo title={title} description={description} />

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "ru" ? "Проектирование агрообъектов" : "Engineering for agro facilities"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === "ru"
              ? "Помогаем превратить задачу в рабочий проект: технологическая схема, компоновка узлов, спецификация оборудования и подготовка к монтажу."
              : "We turn requirements into an actionable project: process flow, equipment layout, bill of materials and preparation for installation."}
          </p>
        </div>
      </section>
    </ServicePageLayout>
  );
}

