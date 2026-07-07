"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark, { LogoDefs } from "./Logo";
import { locales, localePath, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

const LANG_NAMES: Record<Locale, string> = { nl: "Nederlands", de: "Deutsch", en: "English" };

export default function Nav({ t, locale }: { t: Dictionary; locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sluit het menu (en hef daarmee de scroll-lock op) bij elke routewissel —
  // ook wanneer de taalwissel naar /de of /en navigeert.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape sluit het menu + body-scroll locken zolang het open is
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const links = [
    { href: "#merk", label: t.nav_brand },
    { href: "#collectie", label: t.nav_coll },
    { href: "#configurator", label: t.nav_conf },
    { href: "#winkels", label: t.nav_stores },
  ];

  const close = () => setOpen(false);

  return (
    <>
      <nav className={scrolled ? "scrolled" : ""}>
        <LogoDefs />
        <a className="logo" href="#top" aria-label="GUTSKI">
          <LogoMark />
          <span className="logo-word">
            GUT<span>SKI</span>
          </span>
        </a>
        <div className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <div className="lang" role="group" aria-label="Taal / Sprache / Language">
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
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
          <a className="btn small" href="https://skipullies.com" target="_blank" rel="noopener">
            {t.nav_shop} ↗
          </a>
        </div>
        {/* Hamburger — alleen zichtbaar ≤768px, opent het paneel */}
        <button
          type="button"
          className="nav-burger"
          aria-label="Menu openen"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Fullscreen overlay-paneel — sibling van <nav>, boven alles (z-index 2000) */}
      <div id="mobile-menu" className={`mobile-menu${open ? " open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu-bar">
          <a className="logo" href="#top" aria-label="GUTSKI" onClick={close}>
            <LogoMark />
            <span className="logo-word">
              GUT<span>SKI</span>
            </span>
          </a>
          <button type="button" className="mobile-menu-close" aria-label="Menu sluiten" onClick={close}>
            <span />
            <span />
          </button>
        </div>

        <nav className="mobile-menu-links" aria-label="Mobiele navigatie">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={close}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="mobile-menu-foot">
          <div className="lang" role="group" aria-label="Taal / Sprache / Language">
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
                onClick={close}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
          <a
            className="btn"
            href="https://skipullies.com"
            target="_blank"
            rel="noopener"
            onClick={close}
          >
            {t.nav_shop} ↗
          </a>
        </div>
      </div>
    </>
  );
}
