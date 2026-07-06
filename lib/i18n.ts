export const locales = ["nl", "de", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "nl";

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

/** Pad-prefix voor een locale: NL draait op de root, DE/EN op subfolders. */
export function localePath(locale: Locale, path = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return locale === defaultLocale ? p : `/${locale}${p === "/" ? "" : p}`;
}
