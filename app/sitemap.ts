import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gutski.eu";

export default function sitemap(): MetadataRoute.Sitemap {
  const alternates = { languages: { nl: `${SITE}/`, de: `${SITE}/de`, en: `${SITE}/en` } };
  return [
    { url: `${SITE}/`, lastModified: new Date(), alternates },
    { url: `${SITE}/de`, lastModified: new Date(), alternates },
    { url: `${SITE}/en`, lastModified: new Date(), alternates },
  ];
}
