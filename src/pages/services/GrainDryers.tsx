import ServicePageLayout from "./ServicePageLayout";
import { Seo } from "@/components/Seo";
import PortfolioSection from "@/components/PortfolioSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo } from "react";

export default function GrainDryersPage() {
  const { language } = useLanguage();

  const title =
    language === "ru"
      ? "Зерносушилки под ключ — проектирование, монтаж и запуск | АгроСтройКомплекс"
      : "Turnkey grain dryers — design, installation and commissioning | AgroStroyComplex";

  const description =
    language === "ru"
      ? "Зерносушилки под ключ и монтаж: подбор решения, проектирование, поставка, пусконаладка и ввод в эксплуатацию. ЦФО (Воронеж, Тамбов, Курск, Белгород, Липецк)."
      : "Turnkey grain dryers: solution selection, design, supply, installation, commissioning. We work across Central Russia and the European part of РФ.";

  const faqItems = useMemo(() => {
    if (language === "ru") {
      return [
        {
          q: "Как подобрать зерносушилку под хозяйство?",
          a: "Нужно знать культуры, исходную/целевую влажность, производительность (т/ч), тип топлива, доступную электроэнергию и схему логистики на площадке. По этим данным подбираем конфигурацию и делаем компоновку.",
        },
        {
          q: "Вы делаете только монтаж или полный цикл?",
          a: "Работаем под ключ: проектирование/привязка, поставка оборудования, монтаж, подключение, автоматика, пусконаладка и обучение персонала. Если у вас уже куплена сушилка — можем выполнить монтаж и запуск отдельно.",
        },
        {
          q: "Какие сроки по проекту?",
          a: "Срок зависит от комплектации и готовности площадки. Обычно: обследование и ТЗ — 1–3 дня, компоновка/КП — 2–5 дней, монтаж и ввод — по графику объекта.",
        },
        {
          q: "Нужен ли проект и привязка на площадке?",
          a: "Да: привязка нужна для фундаментов, трасс транспортёров, электрики/автоматики и безопасной эксплуатации. Это снижает риски простоев и переделок на монтаже.",
        },
        {
          q: "Можно ли сразу включить транспорт и очистку зерна?",
          a: "Да. Зерносушилка чаще всего работает как часть комплекса. Мы можем спроектировать и поставить транспортёры, узлы очистки и аспирации, а также складирование.",
        },
      ];
    }

    return [
      {
        q: "How do you select a grain dryer for a farm?",
        a: "We need crop types, initial/target moisture, required capacity (t/h), fuel type, available power and site logistics. Based on this, we propose the configuration and layout.",
      },
      {
        q: "Do you provide installation only or turnkey delivery?",
        a: "We can deliver turnkey: engineering, supply, installation, utilities, automation, commissioning and training. If you already purchased the dryer, we can do installation and startup separately.",
      },
      {
        q: "What are typical project timelines?",
        a: "It depends on configuration and site readiness. Typical steps: site assessment and requirements — 1–3 days, layout/quotation — 2–5 days, installation and commissioning — per site schedule.",
      },
      {
        q: "Do we need engineering and site adaptation?",
        a: "Yes. Proper engineering is required for foundations, conveyor routes, electrical/automation and safe operation. It reduces downtime and rework during installation.",
      },
      {
        q: "Can you integrate conveying and cleaning with the dryer?",
        a: "Yes. A dryer usually operates as a part of a grain complex. We can supply and install conveyors, cleaning/aspiration units and storage integration.",
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
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    };
  }, [faqItems]);

  return (
    <ServicePageLayout>
      <Seo title={title} description={description} jsonLd={faqJsonLd} />

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "ru" ? "Зерносушилки под ключ" : "Turnkey grain dryers"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === "ru"
              ? "Зерносушилка под ключ — это не только оборудование, но и грамотная привязка на площадке. Подбираем решение под культуру, объёмы и логистику, выполняем проектирование, поставку, монтаж зерносушилки и запуск."
              : "We deliver grain dryer systems tailored to your crop, capacity and site logistics. We handle design, supply, installation and commissioning."}
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <div className="rounded-lg border border-border/40 p-6 bg-background">
              <h2 className="font-display text-xl font-semibold mb-3">
                {language === "ru" ? "Что входит" : "What is included"}
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>{language === "ru" ? "Подбор оборудования под ТЗ" : "Equipment selection for your requirements"}</li>
                <li>{language === "ru" ? "Проектирование и привязка на площадке" : "Engineering and site adaptation"}</li>
                <li>{language === "ru" ? "Монтаж и пусконаладка" : "Installation and commissioning"}</li>
                <li>{language === "ru" ? "Инструктаж персонала" : "On-site training for personnel"}</li>
              </ul>
            </div>

            <div className="rounded-lg border border-border/40 p-6 bg-background">
              <h2 className="font-display text-xl font-semibold mb-3">
                {language === "ru" ? "География работ" : "Service area"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ru"
                  ? "Воронежская, Тамбовская, Курская, Белгородская, Липецкая области и другие регионы европейской части России."
                  : "Voronezh, Tambov, Kursk, Belgorod, Lipetsk regions and other areas in the European part of Russia."}
              </p>
              <div className="mt-4">
                <a href="/#contact" className="text-primary underline underline-offset-4">
                  {language === "ru" ? "Получить консультацию" : "Get a consultation"}
                </a>
                <span className="mx-3 text-muted-foreground/50">•</span>
                <a href="#prices" className="text-primary underline underline-offset-4">
                  {language === "ru" ? "Цена и расчёт" : "Pricing"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
            {language === "ru" ? "Комплектация и интеграция" : "Configuration and integration"}
          </h2>
          <p className="text-muted-foreground">
            {language === "ru"
              ? "Зерносушилка редко работает “сама по себе”. Мы собираем решение как часть технологической цепочки: приёмка → очистка → сушка → хранение."
              : "A dryer rarely works alone. We design it as part of the process chain: receiving → cleaning → drying → storage."}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="rounded-lg border border-border/40 p-6">
              <h3 className="font-display text-lg font-semibold mb-2">
                {language === "ru" ? "Сушильный модуль" : "Drying module"}
              </h3>
              <p className="text-muted-foreground">
                {language === "ru"
                  ? "Подбор под культуру, производительность и тип топлива."
                  : "Selection for crop type, capacity and fuel."}
              </p>
            </div>
            <div className="rounded-lg border border-border/40 p-6">
              <h3 className="font-display text-lg font-semibold mb-2">
                {language === "ru" ? "Транспорт и подача" : "Conveying & feeding"}
              </h3>
              <p className="text-muted-foreground">
                {language === "ru"
                  ? "Транспортёры, нории, узлы перегрузки, обвязка."
                  : "Conveyors, bucket elevators, transfer points and tie-ins."}
              </p>
              <div className="mt-3">
                <a href="/services/conveyors" className="text-primary underline underline-offset-4">
                  {language === "ru" ? "Установка транспортёров" : "Conveyors installation"}
                </a>
              </div>
            </div>
            <div className="rounded-lg border border-border/40 p-6">
              <h3 className="font-display text-lg font-semibold mb-2">
                {language === "ru" ? "Очистка и аспирация" : "Cleaning & aspiration"}
              </h3>
              <p className="text-muted-foreground">
                {language === "ru"
                  ? "Сепарация, удаление примесей, пылеулавливание."
                  : "Separation, impurities removal and dust control."}
              </p>
              <div className="mt-3">
                <a href="/services/grain-cleaning" className="text-primary underline underline-offset-4">
                  {language === "ru" ? "Оборудование для очистки" : "Grain cleaning equipment"}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-border/40 p-6 bg-card">
            <h3 className="font-display text-lg font-semibold mb-2">
              {language === "ru" ? "Отдельная услуга: монтаж и пусконаладка" : "Separate service: installation and commissioning"}
            </h3>
            <p className="text-muted-foreground">
              {language === "ru"
                ? "Если оборудование уже закуплено, выполним монтаж, подключение, автоматику и ввод в эксплуатацию по регламенту производителя."
                : "If the equipment is already purchased, we can handle installation, utilities/automation and commissioning per manufacturer requirements."}
            </p>
            <div className="mt-4">
              <a
                href="/services/grain-dryers/installation"
                className="text-primary underline underline-offset-4"
              >
                {language === "ru" ? "Монтаж зерносушилки" : "Grain dryer installation"}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
            {language === "ru" ? "Этапы работ" : "Work stages"}
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            <li>{language === "ru" ? "Обследование площадки и сбор исходных данных" : "Site assessment and input data collection"}</li>
            <li>{language === "ru" ? "Компоновка, подбор оборудования, согласование ТЗ" : "Layout, equipment selection and requirements approval"}</li>
            <li>{language === "ru" ? "Проектирование/привязка, подготовка площадки" : "Engineering/site adaptation and site preparation"}</li>
            <li>{language === "ru" ? "Поставка, монтаж, обвязка, электрика и автоматика" : "Supply, installation, tie-ins, electrical and automation"}</li>
            <li>{language === "ru" ? "Пусконаладка, обучение, ввод в эксплуатацию" : "Commissioning, training and handover"}</li>
          </ol>
          <div className="mt-6">
            <a href="/services/design" className="text-primary underline underline-offset-4">
              {language === "ru" ? "Проектирование агрообъектов" : "Engineering services"}
            </a>
          </div>
        </div>
      </section>

      <PortfolioSection
        titleOverride={language === "ru" ? "Кейсы и объекты по агронаправлению" : "Projects and completed sites"}
        defaultFilter="dryers"
        className="border-y border-border/20"
      />

      <section id="prices" className="py-16 bg-background scroll-mt-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
            {language === "ru" ? "Цена зерносушилки под ключ" : "Turnkey grain dryer pricing"}
          </h2>
          <p className="text-muted-foreground">
            {language === "ru"
              ? "Фиксированного “прайса” нет: стоимость зависит от производительности, типа топлива, состава линии (транспорт/очистка), автоматики и готовности площадки. Делаем расчёт и коммерческое предложение под ваш ТЗ."
              : "There is no fixed price list: the cost depends on capacity, fuel type, line scope (conveying/cleaning), automation and site readiness. We prepare a quotation based on your requirements."}
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="rounded-lg border border-border/40 p-6">
              <h3 className="font-display text-lg font-semibold mb-2">
                {language === "ru" ? "Что нужно для расчёта" : "What we need to quote"}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>{language === "ru" ? "Культура и влажность на входе/выходе" : "Crop type and inlet/outlet moisture"}</li>
                <li>{language === "ru" ? "Производительность (т/ч) и режим работы" : "Required capacity (t/h) and operation mode"}</li>
                <li>{language === "ru" ? "Топливо и доступная мощность" : "Fuel type and available power"}</li>
                <li>{language === "ru" ? "Схема площадки (фото/план) и логистика" : "Site plan/photos and logistics"}</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/40 p-6 bg-card">
              <h3 className="font-display text-lg font-semibold mb-2">
                {language === "ru" ? "Получить КП" : "Request a quotation"}
              </h3>
              <p className="text-muted-foreground">
                {language === "ru"
                  ? "Оставьте заявку — уточним исходные данные и подготовим предложение с этапами и сроками."
                  : "Leave a request — we will clarify the inputs and prepare an offer with stages and timelines."}
              </p>
              <div className="mt-4">
                <a href="/#contact" className="text-primary underline underline-offset-4">
                  {language === "ru" ? "Оставить заявку" : "Contact us"}
                </a>
              </div>
            </div>
          </div>
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
              <a className="text-primary underline underline-offset-4" href="/services/zav-turnkey">
                {language === "ru" ? "ЗАВ под ключ" : "Turnkey ZAV"}
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

