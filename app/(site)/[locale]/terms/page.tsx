import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { localeAlternates } from "@/lib/seo";
import { COMPANY, COUNTRY_NAME } from "@/lib/company";
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
    title: t.page_terms_title,
    description: t.page_terms_desc,
    alternates: localeAlternates(locale, "terms"),
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);

  return (
    <PageShell t={t} locale={locale}>
      <article className="prose">
        <h1>{t.tm_h1}</h1>

        <div className="imprint">
          <h2>{t.imp_h}</h2>
          <p className="imprint-block">
            {COMPANY.legal.name}<br />
            {COMPANY.legal.street}, {COMPANY.legal.postalCode} {COMPANY.legal.city}, {COUNTRY_NAME[locale]}<br />
            {t.imp_kvk}: {COMPANY.legal.kvk}<br />
            {t.imp_vat}: {COMPANY.legal.vat}<br />
            {t.imp_email_label}: <a href={`mailto:${COMPANY.legal.email}`}>{COMPANY.legal.email}</a>
          </p>
        </div>

        <p>{t.tm_p_content}</p>
        <p>{t.tm_p_shop}</p>
        <p>{t.tm_p_liability}</p>
      </article>
    </PageShell>
  );
}
