import ServicePageLayout from "./ServicePageLayout";
import { Seo } from "@/components/Seo";
import PortfolioSection from "@/components/PortfolioSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo } from "react";

export default function ZavTurnkeyPage() {
  const { language } = useLanguage();

  const title =
    language === "ru"
      ? "ЗАВ под ключ — проект, оборудование, монтаж | АгроСтройКомплекс"
      : "Turnkey grain complex (ZAV) — design, equipment, installation | AgroStroyComplex";

  const description =
    language === "ru"
      ? "ЗАВ под ключ: проектирование, оборудование, монтаж и пусконаладка. Завальная яма, транспорт, очистка, аспирация, складирование. ЦФО (Воронеж, Тамбов, Курск, Белгород, Липецк)."
      : "Turnkey grain complex (ZAV): receiving pit, conveyors, cleaning, aspiration, storage. Design, installation, commissioning across Central Russia.";

  const faqItems = useMemo(() => {
    if (language === "ru") {
      return [
        {
          q: "Что входит в ЗАВ “под ключ”?",
          a: "Как правило: приёмка (завальная яма), транспорт (нории/транспортёры), очистка, аспирация, распределение потоков, автоматика, а также монтаж, пусконаладка и обучение персонала.",
        },
        {
          q: "Можно ли собрать ЗАВ поэтапно?",
          a: "Да. Часто начинаем с приёмки и транспорта, затем добавляем очистку/аспирацию и автоматизацию. Важно заранее заложить компоновку, чтобы не переделывать трассы и фундаменты.",
        },
        {
          q: "Какие данные нужны для расчёта?",
          a: "Культуры, производительность (т/ч), исходная засорённость/влажность, требуемое качество после очистки, схема площадки и точки складирования/отгрузки.",
        },
        {
          q: "Интегрируете зерносушилку и склад?",
          a: "Да. ЗАВ обычно часть комплекса: приёмка → очистка → сушка → хранение. Спроектируем связку и подберём оборудование под общий поток.",
        },
        {
          q: "Как формируется стоимость ЗАВ?",
          a: "Стоимость зависит от производительности, состава линии, уровня автоматизации, инженерных работ и готовности площадки. Делаем КП с этапами и сроками под ваши исходные данные.",
        },
      ];
    }

    return [
      {
        q: "What is included in a turnkey ZAV?",
        a: "Typically: receiving pit, conveying (elevators/conveyors), cleaning, aspiration, flow distribution, automation, plus installation, commissioning and personnel training.",
      },
      {
        q: "Can a ZAV be built in stages?",
        a: "Yes. Often we start with receiving and conveying, then add cleaning/aspiration and automation. Proper layout planning upfront prevents rework of routes and foundations.",
      },
      {
        q: "What inputs do you need for a quotation?",
        a: "Crop types, required capacity (t/h), initial contamination/moisture, target quality after cleaning, site plan and storage/shipping points.",
      },
      {
        q: "Do you integrate dryers and storage with ZAV?",
        a: "Yes. ZAV is often a part of a full complex: receiving → cleaning → drying → storage. We design the full flow and select equipment for the overall throughput.",
      },
      {
        q: "How is the ZAV price calculated?",
        a: "Pricing depends on capacity, line scope, automation level, engineering works and site readiness. We prepare a quotation with stages and timelines based on your inputs.",
      },
    ];
  }, [language]);

  const faqJsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    };
  }, [faqItems]);

  return (
    <ServicePageLayout>
      <Seo title={title} description={description} jsonLd={faqJsonLd} />

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "ru" ? "ЗАВ под ключ" : "Turnkey grain complex (ZAV)"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === "ru"
              ? "ЗАВ (зерноочистительный комплекс) под ключ — проектирование и монтаж технологической линии под ваши объёмы и логистику. Комплектуем транспортом, узлами очистки/аспирации и автоматикой, выполняем пусконаладку."
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

          <div className="mt-10 rounded-lg border border-border/40 p-6 bg-background">
            <h2 className="font-display text-xl font-semibold mb-3">
              {language === "ru" ? "Что такое ЗАВ и зачем он нужен" : "What is a ZAV and why you need it"}
            </h2>
            <p className="text-muted-foreground">
              {language === "ru"
                ? "Зерноочистительный комплекс (ЗАВ) — это узел, который обеспечивает приёмку и подготовку зерна: убирает примеси, стабилизирует качество партии и подаёт зерно дальше по технологической цепочке."
                : "A grain complex (ZAV) is a facility that receives and prepares grain: removes impurities, stabilizes batch quality and feeds grain further along the process chain."}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              <a href="/services/grain-cleaning" className="text-primary underline underline-offset-4">
                {language === "ru" ? "Очистка зерна" : "Grain cleaning"}
              </a>
              <a href="/services/conveyors" className="text-primary underline underline-offset-4">
                {language === "ru" ? "Транспортёры" : "Conveyors"}
              </a>
              <a href="/services/grain-dryers" className="text-primary underline underline-offset-4">
                {language === "ru" ? "Зерносушилки" : "Grain dryers"}
              </a>
              <a href="#prices" className="text-primary underline underline-offset-4">
                {language === "ru" ? "Цена и расчёт" : "Pricing"}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
            {language === "ru" ? "Состав комплекса (типовая конфигурация)" : "Complex scope (typical configuration)"}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="rounded-lg border border-border/40 p-6">
              <h3 className="font-display text-lg font-semibold mb-2">
                {language === "ru" ? "Технологическая часть" : "Process equipment"}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>{language === "ru" ? "Завальная яма / приёмка" : "Receiving pit / intake"}</li>
                <li>{language === "ru" ? "Нории и транспортёры" : "Bucket elevators and conveyors"}</li>
                <li>{language === "ru" ? "Сепараторы и решётные машины" : "Separators and screening machines"}</li>
                <li>{language === "ru" ? "Аспирация и пылеулавливание" : "Aspiration and dust control"}</li>
                <li>{language === "ru" ? "Распределение потоков и складирование" : "Flow distribution and storage routing"}</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/40 p-6 bg-card">
              <h3 className="font-display text-lg font-semibold mb-2">
                {language === "ru" ? "Инженерная часть" : "Engineering & utilities"}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>{language === "ru" ? "Компоновка и привязка на площадке" : "Layout and site adaptation"}</li>
                <li>{language === "ru" ? "Металлоконструкции, площадки обслуживания" : "Steel structures and service platforms"}</li>
                <li>{language === "ru" ? "Электрика, шкафы управления, автоматизация" : "Electrical, control panels and automation"}</li>
                <li>{language === "ru" ? "Пусконаладка и обучение персонала" : "Commissioning and training"}</li>
              </ul>
              <div className="mt-4">
                <a href="/services/design" className="text-primary underline underline-offset-4">
                  {language === "ru" ? "Проектирование" : "Engineering"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
            {language === "ru" ? "Этапы реализации" : "Implementation stages"}
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            <li>{language === "ru" ? "Сбор исходных данных и обследование площадки" : "Inputs collection and site assessment"}</li>
            <li>{language === "ru" ? "Технологическая схема и компоновка" : "Process flow and layout"}</li>
            <li>{language === "ru" ? "Подбор оборудования и спецификация" : "Equipment selection and bill of materials"}</li>
            <li>{language === "ru" ? "Монтаж, электрика, автоматика" : "Installation, electrical and automation"}</li>
            <li>{language === "ru" ? "Пусконаладка и ввод в эксплуатацию" : "Commissioning and handover"}</li>
          </ol>
          <div className="mt-8 rounded-lg border border-border/40 p-6 bg-background">
            <h3 className="font-display text-lg font-semibold mb-2">
              {language === "ru" ? "Что нужно для расчёта" : "What we need to quote"}
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>{language === "ru" ? "Производительность (т/ч) и культуры" : "Capacity (t/h) and crop types"}</li>
              <li>{language === "ru" ? "Степень засорённости и требования к очистке" : "Contamination level and cleaning targets"}</li>
              <li>{language === "ru" ? "Схема площадки / точки приёмки и отгрузки" : "Site plan / intake and shipping points"}</li>
              <li>{language === "ru" ? "Наличие склада/сушилки или планы интеграции" : "Existing storage/dryer or integration plans"}</li>
            </ul>
            <div className="mt-4">
              <a href="/#contact" className="text-primary underline underline-offset-4">
                {language === "ru" ? "Запросить расчёт" : "Request a quote"}
              </a>
            </div>
          </div>
        </div>
      </section>

      <PortfolioSection
        titleOverride={language === "ru" ? "Кейсы: ЗАВ, приёмка, транспорт и очистка" : "Projects: ZAV, receiving, conveying and cleaning"}
        defaultFilter="zav"
        className="border-y border-border/20"
      />

      <section id="prices" className="py-16 bg-background scroll-mt-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
            {language === "ru" ? "Цена ЗАВ под ключ" : "Turnkey ZAV pricing"}
          </h2>
          <p className="text-muted-foreground">
            {language === "ru"
              ? "Цена зависит от производительности, состава линии (приёмка/транспорт/очистка/аспирация), уровня автоматизации и объёма монтажных работ. Мы готовим КП под вашу задачу с этапами и сроками."
              : "Pricing depends on capacity, line scope (receiving/conveying/cleaning/aspiration), automation level and installation works. We prepare a quote with stages and timelines."}
          </p>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
            {language === "ru" ? "FAQ" : "FAQ"}
          </h2>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details key={item.q} className="rounded-lg border border-border/40 p-5 bg-background">
                <summary className="cursor-pointer font-medium text-foreground">{item.q}</summary>
                <p className="text-muted-foreground mt-3">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-border/40 p-6 bg-background">
            <h3 className="font-display text-lg font-semibold mb-2">
              {language === "ru" ? "Смежные страницы" : "Related services"}
            </h3>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-muted-foreground">
              <a className="text-primary underline underline-offset-4" href="/services/grain-dryers">
                {language === "ru" ? "Зерносушилки под ключ" : "Turnkey grain dryers"}
              </a>
              <a className="text-primary underline underline-offset-4" href="/services/grain-warehouses">
                {language === "ru" ? "Склады зерна" : "Grain warehouses"}
              </a>
              <a className="text-primary underline underline-offset-4" href="/services/hangars">
                {language === "ru" ? "Ангары" : "Hangars"}
              </a>
            </div>
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}

