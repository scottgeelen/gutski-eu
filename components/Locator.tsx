"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Reveal from "./Reveal";
import type { Dealer } from "@/lib/types";
import type { Dictionary } from "@/lib/dictionaries";
import { haversineKm, formatKm, type LatLng } from "@/lib/geo";

const DealerMap = dynamic(() => import("./DealerMap"), { ssr: false });

const FLAGS: Record<string, string> = {
  NL: "🇳🇱", DE: "🇩🇪", BE: "🇧🇪", AT: "🇦🇹", CH: "🇨🇭", FR: "🇫🇷", IT: "🇮🇹", LU: "🇱🇺",
};

type Origin = LatLng & { label: string; kind: "search" | "geo" };
type Status = "idle" | "searching" | "notfound" | "geoloading" | "geoerror";

function routeUrl(d: Dealer) {
  return `https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`;
}

export default function Locator({ t, dealers }: { t: Dictionary; dealers: Dealer[] }) {
  const [cc, setCc] = useState<"all" | string>("all");
  const [q, setQ] = useState("");
  const [focusId, setFocusId] = useState<string | null>(null);
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  // Landenfilter dynamisch uit de data — nieuwe landen verschijnen vanzelf
  const countries = useMemo(
    () => Array.from(new Set(dealers.map((d) => d.country))).sort(),
    [dealers]
  );

  // Debounced geocoding via onze /api/geocode proxy (Nominatim + custom UA)
  useEffect(() => {
    const query = q.trim();
    if (query === "") {
      setStatus("idle");
      setOrigin((prev) => (prev?.kind === "search" ? null : prev));
      return;
    }
    setStatus("searching");
    const ctrl = new AbortController();
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, {
          signal: ctrl.signal,
        });
        const hit = res.ok ? await res.json() : null;
        if (ctrl.signal.aborted) return;
        if (hit && typeof hit.lat === "number") {
          setOrigin({ lat: hit.lat, lng: hit.lng, label: hit.label || query, kind: "search" });
          setStatus("idle");
        } else {
          setOrigin((prev) => (prev?.kind === "search" ? null : prev));
          setStatus("notfound");
        }
      } catch {
        if (!ctrl.signal.aborted) setStatus("idle");
      }
    }, 500); // ~1 req/sec-policy: pas na 500ms rust + vorige request wordt afgebroken
    return () => {
      clearTimeout(id);
      ctrl.abort();
    };
  }, [q]);

  // "Gebruik mijn locatie" via de browser Geolocation API
  const useMyLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("geoerror");
      return;
    }
    setStatus("geoloading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setQ("");
        setOrigin({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: t.loc_you,
          kind: "geo",
        });
        setStatus("idle");
      },
      () => setStatus("geoerror"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Landenfilter + (indien zoekpunt) afstand-sortering, dichtstbij eerst
  const rows = useMemo(() => {
    const list = dealers.filter((d) => cc === "all" || d.country === cc);
    if (!origin) return list;
    return [...list].sort((a, b) => haversineKm(origin, a) - haversineKm(origin, b));
  }, [dealers, cc, origin]);

  const distById = useMemo(() => {
    const m: Record<string, number> = {};
    if (origin) for (const d of dealers) m[d.id] = haversineKm(origin, d);
    return m;
  }, [dealers, origin]);

  const visibleIds = useMemo(() => new Set(rows.map((d) => d.id)), [rows]);

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
              {status === "searching" && <span className="loc-spinner" aria-label={t.loc_searching} />}
            </div>

            <button
              type="button"
              className="loc-geo"
              onClick={useMyLocation}
              disabled={status === "geoloading"}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
              {status === "geoloading" ? t.loc_searching : t.loc_use_location}
            </button>

            {status === "notfound" && <p className="loc-status">{t.loc_notfound}</p>}
            {status === "geoerror" && <p className="loc-status">{t.loc_geo_denied}</p>}
            {origin && status !== "notfound" && (
              <p className="loc-origin mono">📍 {t.loc_results_near} {origin.label}</p>
            )}

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
              {rows.length === 0 && (
                <p style={{ color: "var(--powder)", padding: "14px 4px" }}>{t.loc_empty}</p>
              )}
              {rows.map((d) => (
                <div key={d.id} className={`dealer ${focusId === d.id ? "on" : ""}`}>
                  <button type="button" className="dealer-main" onClick={() => setFocusId(d.id)}>
                    <span className="top">
                      <span className="d-name">{d.name}</span>
                      <span className="cc">{d.country}</span>
                    </span>
                    <span className="d-addr">
                      {d.address}, {d.postal_code ? `${d.postal_code} ` : ""}{d.city}
                    </span>
                    {origin && distById[d.id] !== undefined && (
                      <span className="dist">{formatKm(distById[d.id])}</span>
                    )}
                  </button>
                  <a className="dealer-route" href={routeUrl(d)} target="_blank" rel="noopener">
                    {t.loc_route}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <DealerMap
            dealers={dealers}
            visibleIds={visibleIds}
            focusId={focusId}
            origin={origin}
            routeLabel={t.loc_route}
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
