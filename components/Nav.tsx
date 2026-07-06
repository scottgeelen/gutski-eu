"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import LogoMark, { LogoDefs } from "./Logo";
import { locales, localePath, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

export default function Nav({ t, locale }: { t: Dictionary; locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            <Link key={l} href={localePath(l)} className={l === locale ? "on" : ""} prefetch={false}>
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
        <a className="btn small" href="https://skipullies.com" target="_blank" rel="noopener">
          {t.nav_shop} ↗
        </a>
      </div>

      {/* Hamburger — alleen zichtbaar ≤768px; wordt een X bij openen */}
      <button
        type="button"
        className={`nav-burger${open ? " on" : ""}`}
        aria-label={open ? "Menu sluiten" : "Menu openen"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Fullscreen overlay-paneel */}
      <div id="mobile-menu" className={`mobile-menu${open ? " open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu-links">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={close}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="mobile-menu-foot">
          <div className="lang" role="group" aria-label="Taal / Sprache / Language">
            {locales.map((l) => (
              <Link
                key={l}
                href={localePath(l)}
                className={l === locale ? "on" : ""}
                prefetch={false}
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
    </nav>
  );
}
