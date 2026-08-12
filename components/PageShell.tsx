import Nav from "./Nav";
import Footer from "./Footer";
import StockistModal from "./StockistModal";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

/** Standaard-omhulsel voor de losse content-pagina's (story/privacy/terms):
 *  dezelfde nav, footer en B2B-modal als de homepage. */
export default function PageShell({
  t,
  locale,
  children,
}: {
  t: Dictionary;
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav t={t} locale={locale} />
      <main className="page">
        <div className="wrap page-inner">{children}</div>
      </main>
      <Footer t={t} locale={locale} />
      <StockistModal t={t} locale={locale} />
    </>
  );
}
