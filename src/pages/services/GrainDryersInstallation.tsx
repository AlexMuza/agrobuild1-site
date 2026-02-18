import ServicePageLayout from "./ServicePageLayout";
import { Seo } from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";

export default function GrainDryersInstallationPage() {
  const { language } = useLanguage();

  const title =
    language === "ru"
      ? "Монтаж зерносушилки — установка, пусконаладка | АгроСтройКомплекс"
      : "Grain dryer installation and commissioning | AgroStroyComplex";

  const description =
    language === "ru"
      ? "Монтаж зерносушилки: подготовка площадки, установка, обвязка, автоматика, пусконаладка и ввод в эксплуатацию. Работаем по ЦФО."
      : "Grain dryer installation: site preparation, assembly, utilities, automation, commissioning. We work across Central Russia.";

  return (
    <ServicePageLayout>
      <Seo title={title} description={description} />

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "ru" ? "Монтаж зерносушилки" : "Grain dryer installation"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === "ru"
              ? "Организуем монтаж и запуск зерносушилки: от подготовки площадки до ввода в эксплуатацию."
              : "We handle installation and startup of grain dryers: from site prep to commissioning."}
          </p>

          <h2 className="font-display text-xl font-semibold mt-10 mb-3">{language === "ru" ? "Этапы работ" : "Work stages"}</h2>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            <li>{language === "ru" ? "Выезд и обследование площадки" : "Site visit and assessment"}</li>
            <li>{language === "ru" ? "Монтаж металлоконструкций и оборудования" : "Assembly of structures and equipment"}</li>
            <li>{language === "ru" ? "Подключение электрики/автоматики" : "Electrical and automation setup"}</li>
            <li>{language === "ru" ? "Пусконаладка и тестирование" : "Commissioning and testing"}</li>
          </ol>

          <div className="mt-8">
            <a href="/services/grain-dryers" className="text-primary underline underline-offset-4">
              {language === "ru" ? "Смотреть зерносушилки под ключ" : "See turnkey grain dryers"}
            </a>
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}

