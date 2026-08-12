import type { Dealer } from "./types";
import { localePath, type Locale } from "./i18n";

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
    image: `${SITE}/images/og.jpg`,
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
      streetAddress: "Geerlinglaan 12",
      postalCode: "6415 XE",
      addressLocality: "Heerlen",
      addressCountry: "NL",
    },
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
