import ServicePageLayout from "./ServicePageLayout";
import { Seo } from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ZavTurnkeyPage() {
  const { language } = useLanguage();

  const title =
    language === "ru"
      ? "ЗАВ под ключ — проект, оборудование, монтаж | АгроСтройКомплекс"
      : "Turnkey grain complex (ZAV) — design, equipment, installation | AgroStroyComplex";

  const description =
    language === "ru"
      ? "ЗАВ под ключ: завальная яма, транспортёры, очистка, аспирация, складирование. Проектирование, монтаж, запуск. Работаем по ЦФО."
      : "Turnkey grain complex (ZAV): receiving pit, conveyors, cleaning, aspiration, storage. Design, installation, commissioning across Central Russia.";

  return (
    <ServicePageLayout>
      <Seo title={title} description={description} />

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "ru" ? "ЗАВ под ключ" : "Turnkey grain complex (ZAV)"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === "ru"
              ? "Проектируем и строим ЗАВ под ваши объёмы и логистику. Комплектуем транспортным оборудованием, узлами очистки и автоматикой."
              : "We design and build grain complexes tailored to your capacity and logistics, including conveying, cleaning and automation."}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="rounded-lg border border-border/40 p-6 bg-background">
              <h2 className="font-display text-lg font-semibold mb-2">{language === "ru" ? "Завальная яма" : "Receiving pit"}</h2>
              <p className="text-muted-foreground">
                {language === "ru" ? "Приёмка зерна и распределение потоков." : "Grain intake and flow distribution."}
              </p>
            </div>
            <div className="rounded-lg border border-border/40 p-6 bg-background">
              <h2 className="font-display text-lg font-semibold mb-2">{language === "ru" ? "Транспортёры" : "Conveyors"}</h2>
              <p className="text-muted-foreground">
                {language === "ru" ? "Ленты/скребки/нории, узлы перегрузки." : "Belt/scraper conveyors, bucket elevators, transfer points."}
              </p>
            </div>
            <div className="rounded-lg border border-border/40 p-6 bg-background">
              <h2 className="font-display text-lg font-semibold mb-2">{language === "ru" ? "Очистка и аспирация" : "Cleaning & aspiration"}</h2>
              <p className="text-muted-foreground">
                {language === "ru" ? "Сепарация, удаление примесей, пыль." : "Separation, impurities removal and dust control."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}

