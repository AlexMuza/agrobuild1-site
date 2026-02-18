import ServicePageLayout from "./ServicePageLayout";
import { Seo } from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";

export default function GrainDryersPage() {
  const { language } = useLanguage();

  const title =
    language === "ru"
      ? "Зерносушилки под ключ — проектирование, монтаж и запуск | АгроСтройКомплекс"
      : "Turnkey grain dryers — design, installation and commissioning | AgroStroyComplex";

  const description =
    language === "ru"
      ? "Зерносушилки под ключ: подбор решения, проектирование, поставка, монтаж, пусконаладка. Работаем по ЦФО и европейской части РФ."
      : "Turnkey grain dryers: solution selection, design, supply, installation, commissioning. We work across Central Russia and the European part of РФ.";

  return (
    <ServicePageLayout>
      <Seo title={title} description={description} />

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "ru" ? "Зерносушилки под ключ" : "Turnkey grain dryers"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === "ru"
              ? "Подбираем и монтируем зерносушильные комплексы под вашу культуру, объёмы и логистику. Берём на себя проект, поставку, монтаж и запуск."
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}

