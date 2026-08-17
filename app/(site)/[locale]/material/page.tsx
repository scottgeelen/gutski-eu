import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { localeAlternates } from "@/lib/seo";
import { SHOP } from "@/lib/shop";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";

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
    title: t.page_material_title,
    description: t.page_material_desc,
    alternates: localeAlternates(locale, "material"),
    // Geen eigen openGraph-blok: een leaf-openGraph op een geneste route dropt
    // de geërfde opengraph-image. Zonder blok erft /material de algemene
    // opengraph-image en leidt Next og:title/description af uit de velden hierboven.
  };
}

// De officiële GUTSKI-iconen naast de bijbehorende materiaal-eigenschappen.
const PROPS = [
  { icon: "icon-thermal", key: "prop_thermal", alt: "GUTSKI Thermal" },
  { icon: "icon-active", key: "prop_active", alt: "GUTSKI Active" },
  { icon: "icon-stretch", key: "prop_stretch", alt: "GUTSKI Stretch" },
  { icon: "icon-soft", key: "prop_soft", alt: "GUTSKI Soft" },
  { icon: "icon-fresh-anti-odor", key: "prop_fresh", alt: "GUTSKI Fresh — Anti-Odor" },
] as const;

export default async function MaterialPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const shop = SHOP[locale];

  return (
    <PageShell
      t={t}
      locale={locale}
      slug="material"
      crumb={t.link_material}
      name={t.page_material_title}
      description={t.page_material_desc}
    >
      <article className="prose">
        <span className="mono">{t.story_eyebrow}</span>
        <h1>{t.mat_h1}</h1>
        <p>{t.mat_intro}</p>

        <h2>{t.mat_s1_h}</h2>
        <p>{t.mat_s1_p}</p>

        <Reveal className="prop-grid" aria-label={t.mat_h1}>
          {PROPS.map((p) => (
            <div className="prop-item" key={p.icon}>
              <img src={`/icons/${p.icon}.svg`} alt={p.alt} />
              <p>{t[p.key]}</p>
            </div>
          ))}
        </Reveal>

        <h2>{t.mat_s2_h}</h2>
        <p>{t.mat_s2_p}</p>

        <figure className="prose-figure">
          <img src="/images/shoot-2.jpg" alt={t.shoot_alts[1]} loading="lazy" />
        </figure>

        <h2>{t.mat_s3_h}</h2>
        <p>{t.mat_s3_p}</p>

        <h2>{t.mat_s4_h}</h2>
        <p>{t.mat_s4_p}</p>
        <p className="prose-links">
          <a href={shop.design} target="_blank" rel="noopener">{t.mat_cta} ↗</a>
          <a href={localePath(locale, "/story")}>{t.link_story} →</a>
        </p>
      </article>
    </PageShell>
  );
}
