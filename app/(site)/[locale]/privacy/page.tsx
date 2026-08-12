import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { localeAlternates } from "@/lib/seo";
import { COMPANY } from "@/lib/company";
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
    title: t.page_privacy_title,
    description: t.page_privacy_desc,
    alternates: localeAlternates(locale, "privacy"),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);

  // Het juridische vestigingsadres komt uit COMPANY.legal en wordt hier
  // server-side ingevuld, zodat het niet via de gedeelde dictionary in de
  // client-payload van elke pagina belandt — alleen hier op /privacy.
  const legalAddress = `${COMPANY.legal.street}, ${COMPANY.legal.postalCode} ${COMPANY.legal.city}`;

  return (
    <PageShell t={t} locale={locale}>
      <article className="prose">
        <h1>{t.pv_h1}</h1>
        <p>{t.pv_intro.replace("{address}", legalAddress)}</p>
        <h2>{t.pv_data_h}</h2>
        <p>{t.pv_data_p}</p>
        <h2>{t.pv_use_h}</h2>
        <p>{t.pv_use_p}</p>
        <p>{t.pv_shop_p}</p>
        <h2>{t.pv_rights_h}</h2>
        <p>{t.pv_rights_p}</p>
        <p className="prose-meta">{t.pv_updated}</p>
      </article>
    </PageShell>
  );
}
