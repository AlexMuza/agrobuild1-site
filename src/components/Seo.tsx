import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

type SeoProps = {
  title: string;
  description: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
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

function removeJsonLdScripts() {
  document.head.querySelectorAll('script[data-seo-jsonld="true"]').forEach((el) => el.remove());
}

function upsertJsonLd(jsonLd?: SeoProps["jsonLd"]) {
  removeJsonLdScripts();
  if (!jsonLd) return;

  const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  items.forEach((item, idx) => {
    const el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-seo-jsonld", "true");
    el.setAttribute("data-seo-jsonld-idx", String(idx));
    el.text = JSON.stringify(item);
    document.head.appendChild(el);
  });
}

export function Seo({ title, description, jsonLd }: SeoProps) {
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

    // Structured data (FAQ, Organization, etc). Replaced on each change.
    upsertJsonLd(jsonLd);

    // Cleanup to avoid stale JSON-LD on route changes/unmount.
    return () => {
      removeJsonLdScripts();
    };
  }, [location.pathname, language, title, description, jsonLd]);

  return null;
}

