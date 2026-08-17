import Nav from "./Nav";
import Footer from "./Footer";
import StockistModal from "./StockistModal";
import JsonLd from "./JsonLd";
import { breadcrumbSchema, contentPageSchema } from "@/lib/seo";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

/** Standaard-omhulsel voor de losse content-pagina's (story/material/pully/
 *  privacy/terms): dezelfde nav, footer en B2B-modal als de homepage, plus de
 *  structured data die deze pagina's zelf niet hoeven te herhalen.
 *
 *  `name`/`description` komen uit dezelfde dictionary-sleutels als
 *  generateMetadata op de pagina zelf, zodat schema en <title> niet uit elkaar
 *  kunnen lopen. `crumb` is het korte label voor het kruimelpad. */
export default function PageShell({
  t,
  locale,
  slug,
  crumb,
  name,
  description,
  type,
  children,
}: {
  t: Dictionary;
  locale: Locale;
  slug: string;
  crumb: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage";
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={contentPageSchema({
          locale,
          slug,
          name,
          description,
          ...(type !== undefined ? { type } : {}),
        })}
      />
      <JsonLd data={breadcrumbSchema(locale, slug, crumb)} />
      <Nav t={t} locale={locale} />
      <main className="page">
        <div className="wrap page-inner">{children}</div>
      </main>
      <Footer t={t} locale={locale} />
      <StockistModal t={t} locale={locale} />
    </>
  );
}
