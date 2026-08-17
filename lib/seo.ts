import type { Dealer } from "./types";
import { localePath, type Locale } from "./i18n";
import { COMPANY } from "./company";

export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gutski.eu";

const STORES_NAME: Record<Locale, string> = {
  nl: "GUTSKI verkooppunten",
  de: "GUTSKI Händler",
  en: "GUTSKI stores",
};

/** Absolute canonical + hreflang-alternates (nl/de/en/x-default) voor een
 *  pagina-slug ("" = homepage). Op het canonieke www-domein. */
export function localeAlternates(locale: Locale, slug = "") {
  const p = (l: Locale) => `${SITE}${localePath(l, slug ? `/${slug}` : "/")}`;
  return {
    canonical: p(locale),
    languages: { nl: p("nl"), de: p("de"), en: p("en"), "x-default": p("nl") },
  };
}

// Social-profielen — pas de handles zo nodig aan naar de echte accounts.
export const SOCIALS = {
  instagram: "https://www.instagram.com/gutski.eu",
  tiktok: "https://www.tiktok.com/@gutski.eu",
  facebook: "https://www.facebook.com/gutski.eu",
};

/** Organization/Brand-schema voor GUTSKI (op elke pagina). */
export function organizationSchema(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GUTSKI",
    legalName: "RSG Brands B.V.",
    url: SITE,
    logo: `${SITE}/icon-512.png`,
    description,
    brand: { "@type": "Brand", name: "GUTSKI" },
    sameAs: [
      "https://skipullies.com",
      SOCIALS.instagram,
      SOCIALS.tiktok,
      SOCIALS.facebook,
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.visit.street,
      postalCode: COMPANY.visit.postalCode,
      addressLocality: COMPANY.visit.city,
      addressCountry: "NL",
    },
  };
}

/** WebPage-schema voor een losse contentpagina (story/material/pully/privacy/
 *  voorwaarden). De homepage heeft Organization + ItemList; de contentpagina's
 *  hadden tot nu toe helemaal geen structured data. */
export function contentPageSchema(opts: {
  locale: Locale;
  slug: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage";
}) {
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "WebPage",
    name: opts.name,
    description: opts.description,
    url: `${SITE}${localePath(opts.locale, `/${opts.slug}`)}`,
    inLanguage: opts.locale,
    isPartOf: { "@type": "WebSite", name: "GUTSKI", url: SITE },
    publisher: { "@type": "Organization", name: "GUTSKI", url: SITE },
  };
}

/** BreadcrumbList "GUTSKI > <pagina>" — geeft Google een kruimelpad om in het
 *  zoekresultaat te tonen in plaats van het kale URL-pad. */
export function breadcrumbSchema(locale: Locale, slug: string, label: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "GUTSKI", item: `${SITE}${localePath(locale)}` },
      {
        "@type": "ListItem",
        position: 2,
        name: label,
        item: `${SITE}${localePath(locale, `/${slug}`)}`,
      },
    ],
  };
}

/** ItemList met een Store/LocalBusiness-item per actief verkooppunt. */
export function storesSchema(dealers: Dealer[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: STORES_NAME[locale],
    inLanguage: locale,
    numberOfItems: dealers.length,
    itemListElement: dealers.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Store",
        name: d.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: d.address,
          ...(d.postal_code ? { postalCode: d.postal_code } : {}),
          addressLocality: d.city,
          addressCountry: d.country,
        },
        geo: { "@type": "GeoCoordinates", latitude: d.lat, longitude: d.lng },
        ...(d.phone ? { telephone: d.phone } : {}),
        ...(d.website ? { url: d.website } : {}),
      },
    })),
  };
}
