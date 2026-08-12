import { isLocale, locales } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "GUTSKI — Skipullies uit Limburg voor de Alpen";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return ogImage({ locale: isLocale(locale) ? locale : "nl" });
}
