import { isLocale, locales, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

const HEADING: Record<Locale, string> = {
  nl: "Van Limburg naar de Alpen",
  de: "Von Limburg in die Alpen",
  en: "From Limburg to the Alps",
};

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "GUTSKI — Het verhaal: van Limburg naar de Alpen";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "nl";
  return ogImage({ locale: l, heading: HEADING[l] });
}
