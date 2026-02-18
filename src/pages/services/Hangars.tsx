import ServicePageLayout from "./ServicePageLayout";
import { Seo } from "@/components/Seo";
import PortfolioSection from "@/components/PortfolioSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo } from "react";

export default function HangarsPage() {
  const { language } = useLanguage();

  const title =
    language === "ru"
      ? "Ангары под ключ — металлокаркас, склады, производственные здания | АгроСтройКомплекс"
      : "Turnkey hangars — steel frame warehouses and industrial buildings | AgroStroyComplex";

  const description =
    language === "ru"
      ? "Ангары и склады под ключ из металлокаркаса: проектирование, изготовление и монтаж. ЦФО (Воронеж, Тамбов, Курск, Белгород, Липецк) и европейская часть РФ."
      : "Steel frame hangars and warehouses: design and turnkey construction across Central Russia and the European part of Russia.";

  const faqItems = useMemo(() => {
    if (language === "ru") {
      return [
        {
          q: "Какие ангары вы строите?",
          a: "Металлокаркасные здания под хранение и производство: холодные и утеплённые ангары, склады, мастерские, логистические здания. Конфигурацию подбираем под задачу и площадку.",
        },
        {
          q: "Можно ли построить склад под хранение зерна?",
          a: "Да. Для зерна важно учесть вентиляцию, полы, ворота, организацию потоков и технику безопасности. У нас есть отдельная страница по складам зерна с акцентом на ТЗ для хранения.",
        },
        {
          q: "Что влияет на срок строительства?",
          a: "Пролёты, высота, утепление, тип фундамента, доступность техники на площадке и сезонность. После обследования и ТЗ даём график работ.",
        },
        {
          q: "От чего зависит стоимость?",
          a: "Площадь, конструктив, утепление/ограждающие конструкции, ворота/инженерия, подготовка площадки. Готовим расчёт под ваше ТЗ, без “прайса из воздуха”.",
        },
        {
          q: "Вы делаете проектирование?",
          a: "Да: компоновка, конструктив и привязка на площадке. Проект снижает риски по фундаментам, стыковкам и срокам монтажа.",
        },
      ];
    }

    return [
      {
        q: "What types of hangars do you build?",
        a: "Steel frame buildings for storage and production: cold or insulated hangars, warehouses, workshops and logistics buildings. The configuration is tailored to your task and site.",
      },
      {
        q: "Can you build a grain storage warehouse?",
        a: "Yes. For grain storage it is important to consider ventilation, floors, gates, traffic flow and safety requirements. We also have a dedicated grain warehouse service page.",
      },
      {
        q: "What affects construction timelines?",
        a: "Span, height, insulation, foundation type, equipment availability on site and seasonality. After site assessment we provide a project schedule.",
      },
      {
        q: "What drives the price?",
        a: "Area, structural system, insulation/envelope, gates/utilities and site preparation. We prepare a quote based on your requirements.",
      },
      {
        q: "Do you provide engineering?",
        a: "Yes: layout, structural engineering and site adaptation. Engineering reduces risks with foundations, interfaces and installation timing.",
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
            {language === "ru" ? "Ангары под ключ" : "Turnkey hangars"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === "ru"
              ? "Строим ангары и склады под ключ из металлокаркаса: от проектирования до изготовления и монтажа. Под ваши задачи (хранение, производство, логистика) и условия площадки."
              : "We build hangars, warehouses and steel frame buildings for storage, production and logistics."}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="rounded-lg border border-border/40 p-6 bg-background">
              <h2 className="font-display text-lg font-semibold mb-2">
                {language === "ru" ? "Под задачи бизнеса" : "Designed for your operations"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ru"
                  ? "Хранение техники, склад, производственный участок, логистический терминал."
                  : "Equipment storage, warehouse, workshop, logistics facility."}
              </p>
            </div>
            <div className="rounded-lg border border-border/40 p-6 bg-background">
              <h2 className="font-display text-lg font-semibold mb-2">
                {language === "ru" ? "Холодные и утеплённые" : "Cold or insulated"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ru"
                  ? "Подбираем ограждающие конструкции под режим эксплуатации и бюджет."
                  : "We select the envelope based on operating mode and budget."}
              </p>
            </div>
            <div className="rounded-lg border border-border/40 p-6 bg-background">
              <h2 className="font-display text-lg font-semibold mb-2">
                {language === "ru" ? "Проект + монтаж" : "Engineering + installation"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ru"
                  ? "Компоновка, конструктив, изготовление и монтаж металлокаркаса."
                  : "Layout, structural engineering, fabrication and steel frame installation."}
              </p>
              <div className="mt-3">
                <a href="/services/design" className="text-primary underline underline-offset-4">
                  {language === "ru" ? "Проектирование" : "Engineering"}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-border/40 p-6 bg-background">
            <h2 className="font-display text-xl font-semibold mb-3">
              {language === "ru" ? "Ангар или склад зерна?" : "Hangar or grain warehouse?"}
            </h2>
            <p className="text-muted-foreground">
              {language === "ru"
                ? "Если цель — хранение зерна, важно учесть вентиляцию, покрытия пола, ворота и схему движения техники. Мы строим и универсальные ангары, и специализированные склады под хранение зерна."
                : "If your goal is grain storage, ventilation, floors, gates and traffic flow are critical. We build both universal hangars and specialized grain warehouses."}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              <a href="/services/grain-warehouses" className="text-primary underline underline-offset-4">
                {language === "ru" ? "Строительство складов зерна" : "Grain storage warehouses"}
              </a>
              <a href="/services/zav-turnkey" className="text-primary underline underline-offset-4">
                {language === "ru" ? "ЗАВ под ключ" : "Turnkey ZAV"}
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
            {language === "ru" ? "Этапы строительства" : "Construction stages"}
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            <li>{language === "ru" ? "Обследование площадки и сбор исходных данных" : "Site assessment and input data collection"}</li>
            <li>{language === "ru" ? "Компоновка, проектирование и смета" : "Layout, engineering and estimate"}</li>
            <li>{language === "ru" ? "Изготовление металлоконструкций" : "Steel fabrication"}</li>
            <li>{language === "ru" ? "Фундаментные работы и монтаж каркаса" : "Foundations and frame installation"}</li>
            <li>{language === "ru" ? "Ограждающие конструкции, ворота, доборные элементы" : "Envelope, gates and finishing elements"}</li>
            <li>{language === "ru" ? "Сдача объекта и сопровождение" : "Handover and support"}</li>
          </ol>
        </div>
      </section>

      <PortfolioSection
        titleOverride={language === "ru" ? "Наши объекты: склады, металлоконструкции, комплексы" : "Projects: warehouses, steel structures and complexes"}
        defaultFilter="warehouses"
        className="border-y border-border/20"
      />

      <section id="prices" className="py-16 bg-card scroll-mt-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
            {language === "ru" ? "Цена ангара/склада под ключ" : "Turnkey hangar/warehouse pricing"}
          </h2>
          <p className="text-muted-foreground">
            {language === "ru"
              ? "Стоимость зависит от площади, пролётов, высоты, утепления, типа фундамента и комплектации (ворота, инженерия, площадки обслуживания). Подготовим расчёт и КП под ваше ТЗ."
              : "Pricing depends on area, span, height, insulation, foundation type and scope (gates, utilities, service platforms). We prepare a quote based on your requirements."}
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="rounded-lg border border-border/40 p-6 bg-background">
              <h3 className="font-display text-lg font-semibold mb-2">
                {language === "ru" ? "Что нужно для расчёта" : "What we need to quote"}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>{language === "ru" ? "Назначение здания и режим эксплуатации" : "Building purpose and operating mode"}</li>
                <li>{language === "ru" ? "Размеры/площадь, высота, пролёты" : "Dimensions/area, height and spans"}</li>
                <li>{language === "ru" ? "Утепление и тип ограждений" : "Insulation and envelope type"}</li>
                <li>{language === "ru" ? "Схема площадки и подъезды" : "Site plan and access roads"}</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/40 p-6 bg-background">
              <h3 className="font-display text-lg font-semibold mb-2">
                {language === "ru" ? "Получить консультацию" : "Get a consultation"}
              </h3>
              <p className="text-muted-foreground">
                {language === "ru"
                  ? "Подскажем оптимальный конструктив под задачу и подготовим предложение по срокам и бюджету."
                  : "We will propose a practical structural solution and provide timelines and budget options."}
              </p>
              <div className="mt-4">
                <a href="/#contact" className="text-primary underline underline-offset-4">
                  {language === "ru" ? "Связаться" : "Contact us"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
            {language === "ru" ? "FAQ" : "FAQ"}
          </h2>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details key={item.q} className="rounded-lg border border-border/40 p-5 bg-card">
                <summary className="cursor-pointer font-medium text-foreground">{item.q}</summary>
                <p className="text-muted-foreground mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}

