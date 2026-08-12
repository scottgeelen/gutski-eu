import type { Locale } from "./i18n";

/** Rechtspersoon achter GUTSKI, opgesplitst in twee adresrollen:
 *
 *  - `legal`  — vestigingsadres van de rechtspersoon. Hoort wettelijk in het
 *    colofon/Impressum en de privacyverklaring, en verder nergens prominent.
 *  - `visit`  — winkel-/bezoekadres. Dit is waar bezoekers en de store locator
 *    op slaan; gebruikt in de footer en de JSON-LD (Organization-adres).
 */
export const COMPANY = {
  legal: {
    name: "RSG Brands B.V.",
    street: "Geerlinglaan 12",
    postalCode: "6415 XE",
    city: "Heerlen",
    kvk: "42096308",
    vat: "NL869699106B01",
    email: "info@gutski.eu",
  },
  visit: {
    name: "RSG Brands B.V.",
    street: "Wiebachstraat 77A",
    postalCode: "6466 NG",
    city: "Kerkrade",
    email: "info@gutski.eu",
  },
};

export const COUNTRY_NAME: Record<Locale, string> = {
  nl: "Nederland",
  de: "Niederlande",
  en: "Netherlands",
};
