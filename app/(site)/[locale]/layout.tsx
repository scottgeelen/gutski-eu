import "@/app/globals.css";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { locales, isLocale, localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-syne" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" });

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gutski.eu";

const OG_LOCALE: Record<Locale, string> = { nl: "nl_NL", de: "de_DE", en: "en_GB" };

// og:image komt van de file-convention (opengraph-image.tsx) — geen losse
// og:image-URL hier, zodat de gegenereerde image de enige bron is.

export const viewport = { themeColor: "#0A1322" };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getDictionary(locale);
  return {
    metadataBase: new URL(SITE),
    title: t.meta_title,
    description: t.meta_desc,
    alternates: {
      canonical: localePath(locale),
      languages: {
        nl: "/",
        de: "/de",
        en: "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      // Geen title/description/url hier: Next leidt og:title, og:description en
      // og:url af uit de pagina-metadata (title/description/canonical), zodat
      // subpagina's (privacy/terms) hun eigen tekst tonen én de gedeelde
      // opengraph-image blijven erven i.p.v. de home-waarden.
      siteName: "GUTSKI",
      locale: OG_LOCALE[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
