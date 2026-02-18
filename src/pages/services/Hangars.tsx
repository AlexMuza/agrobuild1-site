import ServicePageLayout from "./ServicePageLayout";
import { Seo } from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HangarsPage() {
  const { language } = useLanguage();

  const title =
    language === "ru"
      ? "Ангары под ключ — металлокаркас, склады, производственные здания | АгроСтройКомплекс"
      : "Turnkey hangars — steel frame warehouses and industrial buildings | AgroStroyComplex";

  const description =
    language === "ru"
      ? "Ангары и складские здания из металлокаркаса: проектирование, изготовление, монтаж. Под ключ по ЦФО и европейской части РФ."
      : "Steel frame hangars and warehouses: design and turnkey construction across Central Russia and the European part of Russia.";

  return (
    <ServicePageLayout>
      <Seo title={title} description={description} />

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "ru" ? "Ангары под ключ" : "Turnkey hangars"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === "ru"
              ? "Строим ангары/склады/металлокаркасные здания под ваши задачи: хранение, производство, логистика."
              : "We build hangars, warehouses and steel frame buildings for storage, production and logistics."}
          </p>
        </div>
      </section>
    </ServicePageLayout>
  );
}

