import type { Locale } from "./i18n";

/** Uitgaande links naar de webshop skipullies.com, in de juiste taalvariant.
 *  NB: controleer de exacte Shopify-handles bij wijzigingen aan de shop. */
export const SHOP: Record<Locale, { women: string; men: string; design: string }> = {
  nl: {
    women: "https://skipullies.com/collections/dames-skipullies",
    men: "https://skipullies.com/collections/heren-skipullies",
    design: "https://skipullies.com/collections/eigen-design-skipully",
  },
  de: {
    women: "https://skipullies.com/de/collections/skipullover-damen",
    men: "https://skipullies.com/de/collections/skipullover-herren",
    design: "https://skipullies.com/de/collections/skipullover-selbst-gestalten",
  },
  en: {
    women: "https://skipullies.com/en/collections/dames-skipullies",
    men: "https://skipullies.com/en/collections/heren-skipullies",
    design: "https://skipullies.com/en/collections/eigen-design-skipully",
  },
};
