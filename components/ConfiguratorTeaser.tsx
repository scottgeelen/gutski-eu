"use client";
import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import type { Dictionary } from "@/lib/dictionaries";

const COLORS = ["#16294A", "#7FB8E8", "#C4373C", "#2E6B4F", "#E8A33D", "#EAF2FC"];

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, v + amt));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

export default function ConfiguratorTeaser({ t }: { t: Dictionary }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % COLORS.length), 3200);
    return () => clearInterval(id);
  }, []);
  const c = COLORS[idx];

  const steps = [
    ["01", t.step1_t, t.step1_s],
    ["02", t.step2_t, t.step2_s],
    ["03", t.step3_t, t.step3_s],
  ];

  return (
    <section id="configurator">
      <div className="wrap config">
        <Reveal className="config-visual">
          <div className="config-stage">
            <div
              className="pully"
              style={{ background: `linear-gradient(165deg,${c},${shade(c, -30)})`, transition: "background .6s" }}
            >
              <span
                style={{
                  position: "absolute", top: "6%", left: "calc(50% - 1px)",
                  width: 2, height: "26%", background: "rgba(10,19,34,.5)",
                }}
              />
            </div>
            <span className="badge">{t.conf_badge}</span>
          </div>
          <div className="dots" role="group" aria-label="Kleuren">
            {COLORS.map((col, i) => (
              <button
                key={col}
                className={i === idx ? "on" : ""}
                style={{ background: col }}
                aria-label={`Kleur ${i + 1}`}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
        </Reveal>
        <Reveal className="config-copy">
          <span className="mono">{t.conf_eyebrow}</span>
          <h2 style={{ fontSize: "clamp(1.9rem,4vw,2.8rem)", textTransform: "uppercase", margin: "14px 0 18px" }}>
            {t.conf_title}
          </h2>
          <p style={{ color: "var(--powder)" }}>{t.conf_sub}</p>
          <div className="steps">
            {steps.map(([num, title, sub]) => (
              <div key={num}>
                <span className="stepnum">{num}</span>
                <div>
                  <b>{title}</b>
                  <span>{sub}</span>
                </div>
              </div>
            ))}
          </div>
          <a className="btn" href="https://skipullies.com" target="_blank" rel="noopener">
            {t.conf_cta} ↗
          </a>
        </Reveal>
      </div>
    </section>
  );
}
