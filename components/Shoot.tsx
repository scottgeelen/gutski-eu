"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import type { Dictionary } from "@/lib/dictionaries";

const SHOTS = [1, 2, 3, 4, 5, 6, 7, 8]; // /public/images/shoot-1.jpg … shoot-8.jpg

// Beschrijvende alt-teksten per campagnefoto (FW26/27, Livigno)
const ALTS: Record<number, string> = {
  1: "Skiër in een GUTSKI skipully op de piste in Livigno",
  2: "Close-up van de geborstelde stof van een GUTSKI pully in de sneeuw",
  3: "Twee vrienden in GUTSKI pullies bij de gondel in Livigno",
  4: "Model in een GUTSKI pully tegen een besneeuwde bergwand",
  5: "Snowboarder in een GUTSKI pully tijdens de FW26/27-shoot",
  6: "Groep in bijpassende GUTSKI pullies op het bergterras",
  7: "Portret van een model met skibril in een GUTSKI pully",
  8: "Après-ski moment in GUTSKI pullies bij zonsondergang in Livigno",
};

export default function Shoot({ t }: { t: Dictionary }) {
  const stripRef = useRef<HTMLDivElement>(null);

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
                alt={dup ? "" : ALTS[n]}
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
    </section>
  );
}
