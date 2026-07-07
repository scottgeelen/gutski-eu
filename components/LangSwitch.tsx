"use client";
import Link from "next/link";
import { locales, localePath, type Locale } from "@/lib/i18n";

const LANG_NAMES: Record<Locale, string> = { nl: "Nederlands", de: "Deutsch", en: "English" };

/** Taalwissel: globe-icoon + drie duidelijk gescheiden knoppen (NL · DE · EN),
 *  met een actieve staat. Gebruikt in de desktop-nav én het mobiele menu. */
export default function LangSwitch({
  locale,
  onNavigate,
}: {
  locale: Locale;
  onNavigate?: () => void;
}) {
  return (
    <div className="lang" role="group" aria-label="Taal / Sprache / Language">
      <span className="lang-globe" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M2.5 12h19M12 2.5c2.7 2.8 2.7 16.2 0 19M12 2.5c-2.7 2.8-2.7 16.2 0 19" />
        </svg>
      </span>
      {locales.map((l) => (
        <Link
          key={l}
          href={localePath(l)}
          className={l === locale ? "on" : ""}
          prefetch={false}
          hrefLang={l}
          title={LANG_NAMES[l]}
          aria-label={LANG_NAMES[l]}
          aria-current={l === locale ? "true" : undefined}
          onClick={onNavigate}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
