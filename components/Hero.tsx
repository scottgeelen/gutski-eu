"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Snow from "./Snow";
import type { Dictionary } from "@/lib/dictionaries";

export default function Hero({ t }: { t: Dictionary }) {
  const peaksRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const p = peaksRef.current;
      if (p && window.scrollY < window.innerHeight)
        p.style.transform = `translateY(${window.scrollY * 0.18}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header id="top" className="has-photo">
      <div className="hero-photo" aria-hidden="true">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
      </div>
      <Snow />
      <div className="peaks" aria-hidden="true" ref={peaksRef}>
        <svg viewBox="0 0 1440 420" preserveAspectRatio="none">
          <path d="M0 420 L0 300 L180 190 L340 290 L520 140 L700 280 L900 90 L1080 250 L1260 170 L1440 300 L1440 420 Z" fill="#0F1D31" />
          <path d="M0 420 L0 350 L220 260 L420 340 L640 220 L860 340 L1060 200 L1280 320 L1440 260 L1440 420 Z" fill="#13253E" />
          <path d="M900 90 L960 150 L930 150 L1000 220 L860 220 Z" fill="#EAF2FC" opacity=".12" />
          <path d="M520 140 L570 195 L545 195 L605 255 L480 255 Z" fill="#EAF2FC" opacity=".09" />
        </svg>
      </div>
      <div className="wrap hero-inner">
        <span className="mono hero-eyebrow">{t.hero_eyebrow}</span>
        <h1>
          {t.hero_title_1} <em>{t.hero_title_2}</em>
        </h1>
        <p className="hero-sub">{t.hero_sub}</p>
        <div className="hero-cta">
          <a className="btn" href="https://skipullies.com" target="_blank" rel="noopener">
            {t.hero_cta1} ↗
          </a>
          <a className="btn ghost" href="#winkels">
            {t.hero_cta2}
          </a>
        </div>
        <div className="hero-meta">
          <div><strong>100%</strong><span>{t.meta1}</span></div>
          <div><strong>EU</strong><span>{t.meta2}</span></div>
          <div><strong>1 st.</strong><span>{t.meta3}</span></div>
        </div>
      </div>
    </header>
  );
}
