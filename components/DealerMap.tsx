"use client";
import { useEffect, useRef, useState } from "react";
import type { Dealer } from "@/lib/types";
import type { LatLng } from "@/lib/geo";
import type { Map as LeafletMap, Marker } from "leaflet";

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

function popupHtml(d: Dealer, routeLabel: string) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`;
  return (
    `<b>${esc(d.name)}</b>` +
    `<br><span style="color:#9DBBDA;font-size:.85rem">${esc(d.address)}, ${esc(d.city)}</span>` +
    `<br><a href="${url}" target="_blank" rel="noopener" ` +
    `style="color:#5FB2FF;font-weight:700;font-size:.82rem;display:inline-block;margin-top:8px">${esc(routeLabel)}</a>`
  );
}

export default function DealerMap({
  dealers,
  visibleIds,
  focusId,
  origin,
  routeLabel,
  onMarkerClick,
}: {
  dealers: Dealer[];
  visibleIds: Set<string>;
  focusId: string | null;
  origin: (LatLng & { label?: string }) | null;
  routeLabel: string;
  onMarkerClick: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const originMarkerRef = useRef<Marker | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);
  // Touch-vergrendeling: op touch-devices start de kaart "locked" (geen drag)
  // met een overlay, zodat de kaart de paginascroll niet kaapt.
  const [touch, setTouch] = useState(false);
  const [active, setActive] = useState(false);

  // Init (leaflet alleen client-side laden)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      LRef.current = L;
      const isTouch =
        typeof window !== "undefined" &&
        window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        dragging: !isTouch,
      }).setView([50.5, 8.0], 5);
      // CARTO Voyager: lichter, met straatnamen en POI's — gratis, geen key
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 20,
      }).addTo(map);
      for (const d of dealers) {
        const icon = L.divIcon({ className: "", html: '<div class="gts-pin"></div>', iconSize: [16, 16], iconAnchor: [8, 8] });
        const m = L.marker([d.lat, d.lng], { icon })
          .addTo(map)
          .bindPopup(popupHtml(d, routeLabel));
        m.on("click", () => onMarkerClick(d.id));
        markersRef.current[d.id] = m;
      }
      if (dealers.length) {
        map.fitBounds(L.latLngBounds(dealers.map((d) => [d.lat, d.lng] as [number, number])).pad(0.3));
      }
      mapRef.current = map;
      if (!cancelled) setTouch(isTouch);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
      originMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Kaart activeren na een tik op de overlay
  const activate = () => {
    mapRef.current?.dragging.enable();
    setActive(true);
  };

  // Opnieuw vergrendelen zodra de gebruiker buiten de kaart scrollt of tikt
  useEffect(() => {
    if (!touch || !active) return;
    const relock = () => {
      mapRef.current?.dragging.disable();
      setActive(false);
    };
    const onPointer = (e: Event) => {
      const el = containerRef.current;
      if (el && e.target instanceof Node && el.contains(e.target)) return;
      relock();
    };
    window.addEventListener("scroll", relock, { passive: true });
    window.addEventListener("pointerdown", onPointer, true);
    return () => {
      window.removeEventListener("scroll", relock);
      window.removeEventListener("pointerdown", onPointer, true);
    };
  }, [touch, active]);

  // Zichtbaarheid van markers bij filteren. Bounds alleen hier als er GEEN
  // zoekpunt is (met zoekpunt regelt het origin-effect de uitsnede).
  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!map || !L) return;
    for (const [id, m] of Object.entries(markersRef.current)) {
      const show = visibleIds.has(id);
      if (show && !map.hasLayer(m)) m.addTo(map);
      if (!show && map.hasLayer(m)) map.removeLayer(m);
    }
    if (origin) return;
    const rows = dealers.filter((d) => visibleIds.has(d.id));
    if (rows.length)
      map.flyToBounds(
        L.latLngBounds(rows.map((d) => [d.lat, d.lng] as [number, number])).pad(0.3),
        { duration: 0.9 }
      );
  }, [visibleIds, dealers, origin]);

  // Zoekpunt: aparte marker + pant/zoomt naar zoekpunt + dichtstbijzijnde winkels
  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!map || !L) return;
    if (originMarkerRef.current) {
      map.removeLayer(originMarkerRef.current);
      originMarkerRef.current = null;
    }
    if (!origin) return;
    const icon = L.divIcon({
      className: "",
      html: '<div class="gts-pin gts-pin-origin"></div>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
    const om = L.marker([origin.lat, origin.lng], { icon, zIndexOffset: 1000 }).addTo(map);
    if (origin.label) om.bindPopup(`<b>${esc(origin.label)}</b>`);
    originMarkerRef.current = om;

    const visible = dealers.filter((d) => visibleIds.has(d.id));
    const nearest = visible
      .map((d) => ({ d, dist: (d.lat - origin.lat) ** 2 + (d.lng - origin.lng) ** 2 }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 4)
      .map((x) => x.d);
    const pts: [number, number][] = [
      [origin.lat, origin.lng],
      ...nearest.map((d) => [d.lat, d.lng] as [number, number]),
    ];
    map.flyToBounds(L.latLngBounds(pts).pad(0.35), { duration: 0.9, maxZoom: 12 });
  }, [origin, dealers, visibleIds]);

  // Focus op geselecteerde dealer
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusId) return;
    const d = dealers.find((x) => x.id === focusId);
    const m = markersRef.current[focusId];
    if (d && m) {
      map.flyTo([d.lat, d.lng], 12, { duration: 0.9 });
      m.openPopup();
    }
  }, [focusId, dealers]);

  return (
    <div className="map-shell">
      <div id="map" ref={containerRef} />
      {touch && !active && (
        <button type="button" className="map-unlock" onClick={activate}>
          <span>Tik om de kaart te bedienen</span>
        </button>
      )}
    </div>
  );
}
