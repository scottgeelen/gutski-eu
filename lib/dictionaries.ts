import "server-only";
import type { Locale } from "./i18n";

const dictionaries = {
  nl: () => import("@/dictionaries/nl.json").then((m) => m.default),
  de: () => import("@/dictionaries/de.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["nl"]>>;
export const getDictionary = (locale: Locale) => dictionaries[locale]();
