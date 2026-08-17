import type { Locale } from "./i18n";

/** Uitgaande links naar de webshop skipullies.com, in de juiste taalvariant.
 *  NB: controleer de exacte Shopify-handles bij wijzigingen aan de shop. */
export const SHOP: Record<
  Locale,
  { home: string; women: string; men: string; design: string; collection: string; ischgl: string }
> = {
  nl: {
    home: "https://skipullies.com/",
    women: "https://skipullies.com/collections/dames-skipullies",
    men: "https://skipullies.com/collections/heren-skipullies",
    design: "https://skipullies.com/collections/eigen-design-skipully",
    collection: "https://skipullies.com/collections/gutski-collectie",
    ischgl: "https://skipullies.com/collections/ischgl-skipullies",
  },
  de: {
    home: "https://skipullies.com/de",
    women: "https://skipullies.com/de/collections/skipullover-damen",
    men: "https://skipullies.com/de/collections/skipullover-herren",
    design: "https://skipullies.com/de/collections/skipullover-selbst-gestalten",
    collection: "https://skipullies.com/de/collections/gutski-collectie",
    ischgl: "https://skipullies.com/de/collections/ischgl-skipullies",
  },
  en: {
    home: "https://skipullies.com/en",
    women: "https://skipullies.com/en/collections/dames-skipullies",
    men: "https://skipullies.com/en/collections/heren-skipullies",
    design: "https://skipullies.com/en/collections/eigen-design-skipully",
    collection: "https://skipullies.com/en/collections/gutski-collectie",
    ischgl: "https://skipullies.com/en/collections/ischgl-skipullies",
  },
};
