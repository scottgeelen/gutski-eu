import type { MetadataRoute } from "next";

// Canoniek domein (matcht canonical/hreflang/og:url). De apex gutski.eu
// redirect naar www, dus de sitemap bevat de www-URL's.
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gutski.eu";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    nl: `${SITE}/`,
    de: `${SITE}/de`,
    en: `${SITE}/en`,
    "x-default": `${SITE}/`,
  };
  const lastModified = new Date();

  // Enige indexeerbare pagina's: de drie locale-homepages. Admin is
  // auth-protected + noindex (en in robots.txt uitgesloten); privacy/terms
  // zijn nog placeholder-ankers, geen echte routes.
  return (["/", "/de", "/en"] as const).map((path) => ({
    url: `${SITE}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    alternates: { languages },
  }));
}
