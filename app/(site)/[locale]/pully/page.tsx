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
    title: t.page_pully_title,
    description: t.page_pully_desc,
    alternates: localeAlternates(locale, "pully"),
    // Geen eigen openGraph-blok: een leaf-openGraph op een geneste route dropt
    // de geërfde opengraph-image. Zonder blok erft /pully de algemene
    // opengraph-image en leidt Next og:title/description af uit de velden hierboven.
  };
}

export default async function PullyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const shop = SHOP[locale];

  return (
    <PageShell
      t={t}
      locale={locale}
      slug="pully"
      crumb={t.link_pully}
      name={t.page_pully_title}
      description={t.page_pully_desc}
    >
      <article className="prose">
        <span className="mono">{t.story_eyebrow}</span>
        <h1>{t.pl_h1}</h1>
        <p>{t.pl_intro}</p>

        <h2>{t.pl_s1_h}</h2>
        <p>{t.pl_s1_p}</p>

        <h2>{t.pl_s2_h}</h2>
        <p>{t.pl_s2_p}</p>

        <h2>{t.pl_s3_h}</h2>
        <p>{t.pl_s3_p}</p>

        <figure className="prose-figure">
          <img src="/images/shoot-6.jpg" alt={t.shoot_alts[5]} loading="lazy" />
        </figure>

        <h2>{t.pl_s4_h}</h2>
        <p>{t.pl_s4_p}</p>
        <p className="prose-links">
          <a href={shop.home} target="_blank" rel="noopener">{t.pl_cta_shop} ↗</a>
          <a href={localePath(locale, "/material")}>{t.link_material} →</a>
          <a href={localePath(locale, "/story")}>{t.link_story} →</a>
        </p>
      </article>
    </PageShell>
  );
}
