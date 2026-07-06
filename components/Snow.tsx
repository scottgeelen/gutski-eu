"use client";
import { useEffect, useRef } from "react";

export default function Snow() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d")!;
    let W = 0, H = 0, raf = 0;
    const size = () => {
      W = cv.width = cv.offsetWidth;
      H = cv.height = cv.offsetHeight;
    };
    size();
    window.addEventListener("resize", size);
    const N = Math.min(140, Math.floor(window.innerWidth / 10));
    const flakes = Array.from({ length: N }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.6 + Math.random() * 2.1,
      s: 0.35 + Math.random() * 0.9,
      w: Math.random() * Math.PI * 2,
      o: 0.25 + Math.random() * 0.55,
    }));
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#EAF2FC";
      for (const f of flakes) {
        f.y += f.s;
        f.w += 0.012;
        f.x += Math.sin(f.w) * 0.4;
        if (f.y > H + 4) {
          f.y = -4;
          f.x = Math.random() * W;
        }
        ctx.globalAlpha = f.o;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, []);
  return <canvas id="snow" ref={ref} aria-hidden="true" />;
}
