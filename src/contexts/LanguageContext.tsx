import { createContext, useContext, useEffect, useMemo, useState } from "react";
import ruHeader from "@/locales/ru/header.json";
import ruHero from "@/locales/ru/hero.json";
import ruAbout from "@/locales/ru/about.json";
import ruServices from "@/locales/ru/services.json";
import ruPortfolio from "@/locales/ru/portfolio.json";
import ruAdvantages from "@/locales/ru/advantages.json";
import ruContact from "@/locales/ru/contact.json";
import ruFooter from "@/locales/ru/footer.json";
import ruNotFound from "@/locales/ru/notFound.json";
import enHeader from "@/locales/en/header.json";
import enHero from "@/locales/en/hero.json";
import enAbout from "@/locales/en/about.json";
import enServices from "@/locales/en/services.json";
import enPortfolio from "@/locales/en/portfolio.json";
import enAdvantages from "@/locales/en/advantages.json";
import enContact from "@/locales/en/contact.json";
import enFooter from "@/locales/en/footer.json";
import enNotFound from "@/locales/en/notFound.json";

export type Language = "ru" | "en";

const STORAGE_KEY = "site-language";

const translations = {
  ru: {
    ...ruHeader,
    hero: ruHero,
    about: ruAbout,
    services: ruServices,
    portfolio: ruPortfolio,
    advantages: ruAdvantages,
    contact: ruContact,
    footer: ruFooter,
    notFound: ruNotFound,
  },
  en: {
    ...enHeader,
    hero: enHero,
    about: enAbout,
    services: enServices,
    portfolio: enPortfolio,
    advantages: enAdvantages,
    contact: enContact,
    footer: enFooter,
    notFound: enNotFound,
  },
} as const;

type TranslationDictionary = (typeof translations)["ru"];

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function isLanguage(value: string | null): value is Language {
  return value === "ru" || value === "en";
}

function getInitialLanguage(): Language {
  const langFromQuery = new URLSearchParams(window.location.search).get("lang");
  if (isLanguage(langFromQuery)) {
    return langFromQuery;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  return isLanguage(stored) ? stored : "ru";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;

    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((prev) => (prev === "ru" ? "en" : "ru")),
      t: translations[language],
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
