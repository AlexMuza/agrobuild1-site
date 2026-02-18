import ServicePageLayout from "./ServicePageLayout";
import { Seo } from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ConveyorsPage() {
  const { language } = useLanguage();

  const title =
    language === "ru"
      ? "Установка транспортёров — монтаж лент, скребков, норий | АгроСтройКомплекс"
      : "Conveyors installation — belt, scraper, bucket elevators | AgroStroyComplex";

  const description =
    language === "ru"
      ? "Установка транспортёров и подъёмников: монтаж, обвязка, пусконаладка. Встраиваем в ЗАВ/склады/сушилки. Работаем по ЦФО."
      : "Conveyors and elevators installation with commissioning. Integration into grain complexes, warehouses and dryers across Central Russia.";

  return (
    <ServicePageLayout>
      <Seo title={title} description={description} />

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "ru" ? "Установка транспортёров" : "Conveyors installation"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === "ru"
              ? "Проектируем трассы и монтируем транспортное оборудование для агрообъектов: ленточные/скребковые транспортёры, нории, узлы перегрузки."
              : "We design routes and install material handling systems: belt/scraper conveyors, bucket elevators and transfer points."}
          </p>
        </div>
      </section>
    </ServicePageLayout>
  );
}

