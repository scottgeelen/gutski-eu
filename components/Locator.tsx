"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Reveal from "./Reveal";
import type { Dealer } from "@/lib/types";
import type { Dictionary } from "@/lib/dictionaries";

const DealerMap = dynamic(() => import("./DealerMap"), { ssr: false });

const FLAGS: Record<string, string> = {
  NL: "🇳🇱", DE: "🇩🇪", BE: "🇧🇪", AT: "🇦🇹", CH: "🇨🇭", FR: "🇫🇷", IT: "🇮🇹", LU: "🇱🇺",
};

export default function Locator({ t, dealers }: { t: Dictionary; dealers: Dealer[] }) {
  const [cc, setCc] = useState<"all" | string>("all");
  const [q, setQ] = useState("");
  const [focusId, setFocusId] = useState<string | null>(null);

  // Landenfilter dynamisch uit de data — nieuwe landen verschijnen vanzelf
  const countries = useMemo(
    () => Array.from(new Set(dealers.map((d) => d.country))).sort(),
    [dealers]
  );

  const filtered = useMemo(
    () =>
      dealers.filter(
        (d) =>
          (cc === "all" || d.country === cc) &&
          (q === "" || `${d.name} ${d.city}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [dealers, cc, q]
  );
  const visibleIds = useMemo(() => new Set(filtered.map((d) => d.id)), [filtered]);

  return (
    <section id="winkels" className="slope-cut">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="mono">{t.loc_eyebrow}</span>
          <h2>{t.loc_title}</h2>
          <p>{t.loc_sub}</p>
        </Reveal>
        <Reveal className="locator-shell">
          <div className="loc-side">
            <div className="loc-search">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                placeholder={t.loc_ph}
                aria-label={t.loc_ph}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="chips">
              <button className={cc === "all" ? "on" : ""} onClick={() => setCc("all")}>
                {t.chip_all}
              </button>
              {countries.map((c) => (
                <button key={c} className={cc === c ? "on" : ""} onClick={() => setCc(c)}>
                  {FLAGS[c] ?? ""} {c}
                </button>
              ))}
            </div>
            <div className="loc-list">
              {filtered.length === 0 && (
                <p style={{ color: "var(--powder)", padding: "14px 4px" }}>{t.loc_empty}</p>
              )}
              {filtered.map((d) => (
                <button
                  key={d.id}
                  className={`dealer ${focusId === d.id ? "on" : ""}`}
                  onClick={() => setFocusId(d.id)}
                >
                  <div className="top">
                    <h3>{d.name}</h3>
                    <span className="cc">{d.country}</span>
                  </div>
                  <p>
                    {d.address}, {d.postal_code ? `${d.postal_code} ` : ""}{d.city}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <DealerMap
            dealers={dealers}
            visibleIds={visibleIds}
            focusId={focusId}
            onMarkerClick={setFocusId}
          />
        </Reveal>
        <Reveal as="p" className="loc-note">
          <span>📍</span>
          <span>
            {t.loc_note_text} <a href="mailto:b2b@gutski.eu">{t.loc_note_link}</a>
          </span>
        </Reveal>
      </div>
    </section>
  );
}
