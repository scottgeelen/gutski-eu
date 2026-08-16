import type { MetadataRoute } from "next";
import { locales, localePath, type Locale } from "@/lib/i18n";

// Canoniek domein (matcht canonical/hreflang/og:url). De apex gutski.eu
// redirect naar www, dus de sitemap bevat de www-URL's.
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gutski.eu";

// Indexeerbare pagina's ("" = homepage). Admin is auth-protected + noindex
// (en in robots.txt uitgesloten), dus niet opgenomen.
const PAGES = ["", "story", "material", "pully", "privacy", "terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const abs = (locale: Locale, slug: string) =>
    `${SITE}${localePath(locale, slug ? `/${slug}` : "/")}`;

  return PAGES.flatMap((slug) => {
    const languages = {
      nl: abs("nl", slug),
      de: abs("de", slug),
      en: abs("en", slug),
      "x-default": abs("nl", slug),
    };
    return locales.map((locale) => ({
      url: abs(locale, slug),
      lastModified,
      changeFrequency: "monthly" as const,
      alternates: { languages },
    }));
  });
}
