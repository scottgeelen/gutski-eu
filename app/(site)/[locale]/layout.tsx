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

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gutski.eu";

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
      title: t.meta_title,
      description: t.meta_desc,
      url: localePath(locale),
      siteName: "GUTSKI",
      images: ["/images/og.jpg"],
      locale,
      type: "website",
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
