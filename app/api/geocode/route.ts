import { NextResponse } from "next/server";

// Server-side proxy naar Nominatim (OpenStreetMap). Draait server-side zodat we
// de verplichte custom User-Agent kunnen meesturen (browsers mogen die header
// niet zetten). Gratis, geen API-key. De client debounced ~500ms.
const UA = "GutskiStoreLocator/1.0 (info@gutski.eu)";
const COUNTRIES = "nl,de,be,at,ch,fr,it,lu";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q) return NextResponse.json(null);

  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1" +
    `&countrycodes=${COUNTRIES}&q=${encodeURIComponent(q)}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "nl,de,en" },
      // Identieke zoekopdrachten een dag cachen — ontlast Nominatim (policy).
      next: { revalidate: 86400 },
    });
    if (!res.ok) return NextResponse.json(null, { status: 502 });

    const data = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name?: string;
    }>;
    const hit = Array.isArray(data) ? data[0] : null;
    if (!hit) return NextResponse.json(null);

    return NextResponse.json({
      lat: parseFloat(hit.lat),
      lng: parseFloat(hit.lon),
      label: (hit.display_name || q).split(",")[0].trim(),
    });
  } catch {
    return NextResponse.json(null, { status: 502 });
  }
}
