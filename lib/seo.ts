import type { Dealer } from "./types";

export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gutski.eu";

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
      streetAddress: "Wiebachstraat 77A",
      postalCode: "6466 NG",
      addressLocality: "Kerkrade",
      addressCountry: "NL",
    },
  };
}

/** ItemList met een Store/LocalBusiness-item per actief verkooppunt. */
export function storesSchema(dealers: Dealer[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "GUTSKI verkooppunten",
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
