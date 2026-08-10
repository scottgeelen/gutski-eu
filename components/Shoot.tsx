"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import { SHOP } from "@/lib/shop";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

const SHOTS = [1, 2, 3, 4, 5, 6, 7, 8]; // /public/images/shoot-1.jpg … shoot-8.jpg

export default function Shoot({ t, locale }: { t: Dictionary; locale: Locale }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const shop = SHOP[locale];

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    let raf = 0;
    let running = false;
    let setWidth = 0;
    let speed = 0; // px per frame — afgeleid van setWidth zodat de cyclusduur constant is
    const DURATION = isTouch ? 45 : 38; // seconden per volledige loop (mobiel iets rustiger)

    let hovering = false, dragging = false, touching = false, wheeling = false;
    let wheelTimer = 0, touchTimer = 0;
    let startX = 0, startScroll = 0;
    const paused = () => hovering || dragging || touching || wheeling;

    const measure = () => {
      const figs = strip.querySelectorAll<HTMLElement>("figure");
      if (figs.length > SHOTS.length) {
        setWidth = figs[SHOTS.length].offsetLeft - figs[0].offsetLeft;
        speed = setWidth > 0 ? setWidth / (DURATION * 60) : 0;
      }
    };

    const tick = () => {
      if (!paused() && speed > 0) {
        if (setWidth <= 0) measure();
        strip.scrollLeft += speed;
        // Naadloze loop: de tweede (gedupliceerde) set is identiek, dus
        // scrollLeft met één set-breedte terugzetten is onzichtbaar.
        if (strip.scrollLeft >= setWidth) strip.scrollLeft -= setWidth;
      }
      raf = requestAnimationFrame(tick);
    };

    const startAuto = () => {
      if (running) return;
      running = true;
      measure();
      // Kleine vertraging zodat de staggered reveal eerst grotendeels afspeelt.
      window.setTimeout(() => { raf = requestAnimationFrame(tick); }, 900);
    };

    // Staggered reveal: pas triggeren als de strip echt in beeld komt, één keer.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            strip.classList.add("in");
            io.disconnect();
            if (!reduce) startAuto();
          }
        }
      },
      { threshold: 0.15 }
    );
    io.observe(strip);

    // Onder reduced-motion: geen auto-scroll, geen drag-overrides — alleen
    // native (handmatig) scrollen. Figuren zijn statisch zichtbaar (CSS).
    if (reduce) return () => io.disconnect();

    // Pauzeer bij hover (desktop)
    const onEnter = () => { hovering = true; };
    const onLeave = () => { hovering = false; };

    // Muis-drag-to-scroll (desktop); touch laat de native scroll z'n werk doen
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        dragging = true;
        startX = e.clientX;
        startScroll = strip.scrollLeft;
        strip.classList.add("dragging");
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      strip.scrollLeft = startScroll - (e.clientX - startX);
    };
    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      strip.classList.remove("dragging");
    };

    // Touch swipe: pauzeer tijdens de touch, hervat ná de momentum-scroll
    const onTouchStart = () => { touching = true; clearTimeout(touchTimer); };
    const onTouchEnd = () => {
      clearTimeout(touchTimer);
      touchTimer = window.setTimeout(() => { touching = false; }, 700);
    };

    // Horizontaal scrollen (trackpad/shift-wheel) pauzeert kort; verticaal niet
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      wheeling = true;
      clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => { wheeling = false; }, 700);
    };

    strip.addEventListener("mouseenter", onEnter);
    strip.addEventListener("mouseleave", onLeave);
    strip.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    strip.addEventListener("touchstart", onTouchStart, { passive: true });
    strip.addEventListener("touchend", onTouchEnd, { passive: true });
    strip.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(wheelTimer);
      clearTimeout(touchTimer);
      strip.removeEventListener("mouseenter", onEnter);
      strip.removeEventListener("mouseleave", onLeave);
      strip.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      strip.removeEventListener("touchstart", onTouchStart);
      strip.removeEventListener("touchend", onTouchEnd);
      strip.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Gedupliceerde set voor de naadloze loop (net als Marquee.tsx)
  const shots = [...SHOTS, ...SHOTS];

  return (
    <section id="shoot" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="mono">{t.shoot_eyebrow}</span>
          <h2>{t.shoot_title}</h2>
          <p>{t.shoot_sub}</p>
        </Reveal>
      </div>
      <div className="strip" ref={stripRef} role="region" aria-label={t.shoot_title}>
        {shots.map((n, i) => {
          const dup = i >= SHOTS.length;
          return (
            <figure key={i} style={{ transitionDelay: `${(i % SHOTS.length) * 90}ms` }} aria-hidden={dup || undefined}>
              <Image
                src={`/images/shoot-${n}.jpg`}
                alt={dup ? "" : t.shoot_alts[n - 1]}
                fill
                sizes="(max-width: 640px) 74vw, 400px"
                style={{ objectFit: "cover" }}
                className="ld"
                loading="lazy"
                draggable={false}
              />
              <figcaption>
                LIVIGNO · {String(n).padStart(2, "0")}/{String(SHOTS.length).padStart(2, "0")}
              </figcaption>
            </figure>
          );
        })}
      </div>

      {/* Zichtbare CTA-links naar de webshop (juiste taalvariant) + store locator */}
      <div className="wrap shop-cta">
        <a href={shop.women} target="_blank" rel="noopener">{t.shop_women} ↗</a>
        <a href={shop.men} target="_blank" rel="noopener">{t.shop_men} ↗</a>
        <a href={shop.design} target="_blank" rel="noopener">{t.shop_design} ↗</a>
        <a href="#winkels" className="shop-cta-store">{t.shop_find_store} →</a>
      </div>
    </section>
  );
}
