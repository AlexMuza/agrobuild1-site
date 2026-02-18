import ServicePageLayout from "./ServicePageLayout";
import { Seo } from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";

export default function GrainCleaningPage() {
  const { language } = useLanguage();

  const title =
    language === "ru"
      ? "Оборудование для очистки зерна — подбор и монтаж | АгроСтройКомплекс"
      : "Grain cleaning equipment — selection and installation | AgroStroyComplex";

  const description =
    language === "ru"
      ? "Оборудование для очистки зерна: сепараторы, аспирация, транспорт. Подбор под ТЗ, монтаж и запуск. Работаем по ЦФО."
      : "Grain cleaning systems: separators, aspiration, conveying. Selection, installation and commissioning across Central Russia.";

  return (
    <ServicePageLayout>
      <Seo title={title} description={description} />

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "ru" ? "Оборудование для очистки зерна" : "Grain cleaning equipment"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === "ru"
              ? "Подбираем и устанавливаем оборудование очистки зерна под культуру и производительность: узлы сепарации, аспирации и транспорт."
              : "We design and install grain cleaning systems tailored to crop and capacity: separation, aspiration and conveying."}
          </p>
        </div>
      </section>
    </ServicePageLayout>
  );
}

