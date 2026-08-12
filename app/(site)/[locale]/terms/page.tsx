import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, localePath, type Locale } from "@/lib/i18n";
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
    openGraph: {
      title: t.page_terms_title,
      description: t.page_terms_desc,
      url: localePath(locale, "/terms"),
      type: "article",
    },
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
            {COMPANY.name}<br />
            {COMPANY.street}, {COMPANY.postalCity}, {COUNTRY_NAME[locale]}<br />
            {t.imp_kvk}: {COMPANY.kvk}<br />
            {t.imp_vat}: {COMPANY.vat}<br />
            {t.imp_email_label}: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          </p>
        </div>

        <p>{t.tm_p_content}</p>
        <p>{t.tm_p_shop}</p>
        <p>{t.tm_p_liability}</p>
      </article>
    </PageShell>
  );
}
