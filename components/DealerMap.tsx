"use client";
import { useEffect, useRef } from "react";
import type { Dealer } from "@/lib/types";
import type { Map as LeafletMap, Marker } from "leaflet";

export default function DealerMap({
  dealers,
  visibleIds,
  focusId,
  onMarkerClick,
}: {
  dealers: Dealer[];
  visibleIds: Set<string>;
  focusId: string | null;
  onMarkerClick: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const LRef = useRef<typeof import("leaflet") | null>(null);

  // Init (leaflet alleen client-side laden)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView([50.5, 8.0], 5);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);
      for (const d of dealers) {
        const icon = L.divIcon({ className: "", html: '<div class="gts-pin"></div>', iconSize: [16, 16], iconAnchor: [8, 8] });
        const m = L.marker([d.lat, d.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<b>${d.name}</b><br><span style="color:#9DBBDA;font-size:.85rem">${d.address}, ${d.city}</span>`
          );
        m.on("click", () => onMarkerClick(d.id));
        markersRef.current[d.id] = m;
      }
      if (dealers.length) {
        map.fitBounds(L.latLngBounds(dealers.map((d) => [d.lat, d.lng] as [number, number])).pad(0.3));
      }
      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Zichtbaarheid van markers bij filteren
  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!map || !L) return;
    for (const [id, m] of Object.entries(markersRef.current)) {
      const show = visibleIds.has(id);
      if (show && !map.hasLayer(m)) m.addTo(map);
      if (!show && map.hasLayer(m)) map.removeLayer(m);
    }
    const rows = dealers.filter((d) => visibleIds.has(d.id));
    if (rows.length)
      map.flyToBounds(
        L.latLngBounds(rows.map((d) => [d.lat, d.lng] as [number, number])).pad(0.3),
        { duration: 0.9 }
      );
  }, [visibleIds, dealers]);

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

  return <div id="map" ref={containerRef} />;
}
