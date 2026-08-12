import type { Locale } from "./i18n";

/** Rechtspersoon achter GUTSKI — gebruikt in footer, colofon/Impressum en JSON-LD. */
export const COMPANY = {
  name: "RSG Brands B.V.",
  street: "Geerlinglaan 12",
  postalCity: "6415 XE Heerlen",
  kvk: "42096308",
  vat: "NL869699106B01",
  email: "info@gutski.eu",
};

export const COUNTRY_NAME: Record<Locale, string> = {
  nl: "Nederland",
  de: "Niederlande",
  en: "Netherlands",
};
