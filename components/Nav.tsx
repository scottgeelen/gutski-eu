"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark, { LogoDefs } from "./Logo";
import { locales, localePath, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

export default function Nav({ t, locale }: { t: Dictionary; locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={scrolled ? "scrolled" : ""}>
      <LogoDefs />
      <a className="logo" href="#top" aria-label="GUTSKI">
        <LogoMark />
        <span className="logo-word">
          GUT<span>SKI</span>
        </span>
      </a>
      <div className="nav-links">
        <a href="#merk">{t.nav_brand}</a>
        <a href="#collectie">{t.nav_coll}</a>
        <a href="#configurator">{t.nav_conf}</a>
        <a href="#winkels">{t.nav_stores}</a>
        <div className="lang" role="group" aria-label="Taal / Sprache / Language">
          {locales.map((l) => (
            <Link key={l} href={localePath(l)} className={l === locale ? "on" : ""} prefetch={false}>
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
        <a className="btn small" href="https://skipullies.com" target="_blank" rel="noopener">
          {t.nav_shop} ↗
        </a>
      </div>
    </nav>
  );
}
