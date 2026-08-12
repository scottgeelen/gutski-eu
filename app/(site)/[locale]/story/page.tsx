import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { localeAlternates } from "@/lib/seo";
import { SHOP } from "@/lib/shop";
import PageShell from "@/components/PageShell";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getDictionary(locale);
  return {
    title: t.page_story_title,
    description: t.page_story_desc,
    alternates: localeAlternates(locale, "story"),
    openGraph: {
      title: t.page_story_title,
      description: t.page_story_desc,
      url: localePath(locale, "/story"),
      type: "article",
    },
  };
}

export default async function StoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const shop = SHOP[locale];
  const home = localePath(locale);

  return (
    <PageShell t={t} locale={locale}>
      <article className="prose">
        <span className="mono">{t.nav_story}</span>
        <h1>{t.st_h1}</h1>
        <p>{t.st_p1}</p>
        <p>{t.st_p2}</p>
        <p>{t.st_p3}</p>
        <p className="prose-links">
          <a href={shop.design} target="_blank" rel="noopener">{t.shop_design} ↗</a>
        </p>
        <p>{t.st_p4}</p>
        <p className="prose-links">
          <a href={shop.women} target="_blank" rel="noopener">{t.shop_women} ↗</a>
          <a href={shop.men} target="_blank" rel="noopener">{t.shop_men} ↗</a>
          <a href={`${home}#winkels`}>{t.shop_find_store} →</a>
        </p>
      </article>
    </PageShell>
  );
}
