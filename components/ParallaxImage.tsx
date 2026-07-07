"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

/** Lichte parallax (±20px) op scroll via transform — geen layout shift.
 *  De inner-schaal (1.1) zorgt dat de translate nooit een rand blootlegt. */
export default function ParallaxImage({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 (element onder beeld) .. +1 (boven beeld), 0 = gecentreerd
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      const y = Math.max(-1, Math.min(1, p)) * 20;
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(1.1)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="parallax-fill">
      <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} className="ld" />
    </div>
  );
}
