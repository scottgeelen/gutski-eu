"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type DealerFormState = {
  status: "idle" | "ok" | "error";
  message?: string;
  lat?: number;
  lng?: number;
};

const GEO_UA = "GutskiStoreLocator/1.0 (info@gutski.eu)";
const GEO_FAIL =
  "Adres niet gevonden — controleer de gegevens of vul lat/lng handmatig in.";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function dealerFromForm(formData: FormData) {
  const num = (v: FormDataEntryValue | null) => {
    const s = String(v ?? "").trim();
    return s === "" ? NaN : Number(s);
  };
  return {
    name: String(formData.get("name") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    postal_code: String(formData.get("postal_code") ?? "").trim() || null,
    country: String(formData.get("country") ?? "NL").toUpperCase().slice(0, 2),
    lat: num(formData.get("lat")),
    lng: num(formData.get("lng")),
    phone: String(formData.get("phone") ?? "").trim() || null,
    website: String(formData.get("website") ?? "").trim() || null,
    active: formData.get("active") === "on",
  };
}

type FormDealer = ReturnType<typeof dealerFromForm>;

/** Zet een adres om naar coördinaten via Nominatim (OpenStreetMap).
 *  Probeert eerst de gestructureerde query, daarna een vrije-tekst-fallback. */
async function geocodeAddress(
  street: string,
  postal: string | null,
  city: string,
  country: string
): Promise<{ lat: number; lng: number } | null> {
  const cc = country.toLowerCase();
  const base = (extra: Record<string, string>) =>
    "https://nominatim.openstreetmap.org/search?" +
    new URLSearchParams({ format: "json", limit: "1", ...extra }).toString();

  const structured: Record<string, string> = {};
  if (street) structured.street = street;
  if (postal) structured.postalcode = postal;
  if (city) structured.city = city;
  if (cc) structured.countrycodes = cc;

  const freeform: Record<string, string> = {
    q: [street, postal, city, country].filter(Boolean).join(", "),
  };
  if (cc) freeform.countrycodes = cc;

  const urls = [base(structured), base(freeform)];
  for (let i = 0; i < urls.length; i++) {
    // Nominatim-policy: max 1 request/seconde — pauzeer vóór de fallback
    if (i > 0) await new Promise((r) => setTimeout(r, 1100));
    try {
      const res = await fetch(urls[i], {
        headers: { "User-Agent": GEO_UA, "Accept-Language": "nl,de,en" },
        cache: "no-store",
      });
      if (!res.ok) continue;
      const data = (await res.json()) as Array<{ lat: string; lon: string }>;
      const hit = Array.isArray(data) ? data[0] : null;
      if (hit) {
        const lat = parseFloat(hit.lat);
        const lng = parseFloat(hit.lon);
        if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
      }
    } catch {
      /* volgende poging */
    }
  }
  return null;
}

type Existing = { address: string; postal_code: string | null; city: string; country: string; lat: number; lng: number } | null;

/** Bepaalt de coördinaten: geocode als lat/lng leeg zijn of als het adres
 *  wijzigde (en de coördinaten niet handmatig zijn aangepast). */
async function resolveCoords(
  d: FormDealer,
  existing: Existing
): Promise<{ lat: number; lng: number; geocoded: boolean } | null> {
  const empty = !Number.isFinite(d.lat) || !Number.isFinite(d.lng);
  const latlngChanged =
    existing != null && (d.lat !== existing.lat || d.lng !== existing.lng);
  const addrChanged =
    existing != null &&
    (existing.address !== d.address ||
      (existing.postal_code ?? "") !== (d.postal_code ?? "") ||
      existing.city !== d.city ||
      existing.country !== d.country);

  if (!empty && !(addrChanged && !latlngChanged)) {
    return { lat: d.lat, lng: d.lng, geocoded: false };
  }
  const hit = await geocodeAddress(d.address, d.postal_code, d.city, d.country);
  return hit ? { ...hit, geocoded: true } : null;
}

function okMessage(c: { lat: number; lng: number; geocoded: boolean }): string {
  const coords = `${c.lat.toFixed(2)}, ${c.lng.toFixed(2)}`;
  return c.geocoded
    ? `Opgeslagen — locatie gevonden op ${coords}`
    : `Opgeslagen — coördinaten ${coords}`;
}

export async function createDealer(
  _prev: DealerFormState,
  formData: FormData
): Promise<DealerFormState> {
  const supabase = await requireUser();
  const d = dealerFromForm(formData);
  const coords = await resolveCoords(d, null);
  if (!coords) return { status: "error", message: GEO_FAIL };

  const { error } = await supabase
    .from("dealers")
    .insert({ ...d, lat: coords.lat, lng: coords.lng });
  if (error) return { status: "error", message: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  return { status: "ok", message: okMessage(coords), lat: coords.lat, lng: coords.lng };
}

export async function updateDealer(
  _prev: DealerFormState,
  formData: FormData
): Promise<DealerFormState> {
  const supabase = await requireUser();
  const id = String(formData.get("id"));
  const d = dealerFromForm(formData);

  const { data: existing } = await supabase
    .from("dealers")
    .select("address,postal_code,city,country,lat,lng")
    .eq("id", id)
    .single();

  const coords = await resolveCoords(d, (existing as Existing) ?? null);
  if (!coords) return { status: "error", message: GEO_FAIL };

  const { error } = await supabase
    .from("dealers")
    .update({ ...d, lat: coords.lat, lng: coords.lng })
    .eq("id", id);
  if (error) return { status: "error", message: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  return { status: "ok", message: okMessage(coords), lat: coords.lat, lng: coords.lng };
}

export async function toggleDealer(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id"));
  const active = formData.get("active") === "true";
  const { error } = await supabase.from("dealers").update({ active: !active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

export async function deleteDealer(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("dealers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
