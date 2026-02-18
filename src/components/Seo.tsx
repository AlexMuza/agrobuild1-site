import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

type SeoProps = {
  title: string;
  description: string;
};

const CANONICAL_ORIGIN = "https://www.agrobuild1.com";

function upsertMeta(propertyOrName: "name" | "property", key: string, content: string) {
  const selector = `meta[${propertyOrName}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(propertyOrName, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, attrs: Record<string, string>) {
  const selectorParts = [`link[rel="${rel}"]`];
  if (attrs.hreflang) selectorParts.push(`[hreflang="${attrs.hreflang}"]`);
  const selector = selectorParts.join("");

  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (attrs.hreflang) el.setAttribute("hreflang", attrs.hreflang);
    document.head.appendChild(el);
  }

  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "hreflang") return;
    el!.setAttribute(k, v);
  });
}

export function Seo({ title, description }: SeoProps) {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const pathname = location.pathname || "/";
    const canonicalUrl = `${CANONICAL_ORIGIN}${pathname}`;

    document.title = title;
    upsertMeta("name", "description", description);

    // Canonical + hreflang. Canonical doesn't include ?lang.
    upsertLink("canonical", { href: canonicalUrl });
    upsertLink("alternate", { hreflang: "ru", href: `${canonicalUrl}?lang=ru` });
    upsertLink("alternate", { hreflang: "en", href: `${canonicalUrl}?lang=en` });
    upsertLink("alternate", { hreflang: "x-default", href: canonicalUrl });

    // Open Graph / Twitter (basic). Social image stays global.
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:locale", language === "ru" ? "ru_RU" : "en_US");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
  }, [location.pathname, language, title, description]);

  return null;
}

