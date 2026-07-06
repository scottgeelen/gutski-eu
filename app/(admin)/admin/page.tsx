import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Dealer } from "@/lib/types";
import { createDealer, updateDealer, toggleDealer, deleteDealer, signOut } from "./actions";

export const metadata = { title: "GUTSKI Admin — Verkooppunten", robots: { index: false } };
export const dynamic = "force-dynamic";

const input = {
  background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 10,
  color: "var(--ice)", padding: "10px 12px", font: "inherit", fontSize: ".9rem", width: "100%",
} as const;
const label = { display: "grid", gap: 6, fontSize: ".78rem", color: "var(--powder)" } as const;

function DealerFields({ d }: { d?: Dealer }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
      <label style={label}>Naam<input style={input} name="name" defaultValue={d?.name} required /></label>
      <label style={label}>Adres<input style={input} name="address" defaultValue={d?.address} required /></label>
      <label style={label}>Plaats<input style={input} name="city" defaultValue={d?.city} required /></label>
      <label style={label}>Postcode<input style={input} name="postal_code" defaultValue={d?.postal_code ?? ""} /></label>
      <label style={label}>Land (ISO-2)<input style={input} name="country" defaultValue={d?.country ?? "NL"} maxLength={2} required /></label>
      <label style={label}>Latitude<input style={input} name="lat" type="number" step="any" defaultValue={d?.lat} required /></label>
      <label style={label}>Longitude<input style={input} name="lng" type="number" step="any" defaultValue={d?.lng} required /></label>
      <label style={label}>Telefoon<input style={input} name="phone" defaultValue={d?.phone ?? ""} /></label>
      <label style={label}>Website<input style={input} name="website" defaultValue={d?.website ?? ""} /></label>
      <label style={{ ...label, alignSelf: "end", flexDirection: "row" as const }}>
        <span><input name="active" type="checkbox" defaultChecked={d ? d.active : true} /> Actief</span>
      </label>
    </div>
  );
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabase.from("dealers").select("*").order("country").order("city");
  const dealers = (data ?? []) as Dealer[];

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px", fontFamily: "var(--font-dm-sans),sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-syne),sans-serif", textTransform: "uppercase" }}>
          Verkooppunten <span style={{ color: "var(--glacier)" }}>({dealers.length})</span>
        </h1>
        <form action={signOut}><button className="btn ghost small" type="submit">Uitloggen</button></form>
      </header>

      <details style={{ background: "var(--slope)", border: "1px solid var(--line)", borderRadius: 16, padding: 22, marginBottom: 28 }}>
        <summary style={{ cursor: "pointer", fontWeight: 700 }}>+ Nieuw verkooppunt</summary>
        <form action={createDealer} style={{ marginTop: 18, display: "grid", gap: 16 }}>
          <DealerFields />
          <button className="btn" type="submit" style={{ justifySelf: "start" }}>Toevoegen</button>
        </form>
      </details>

      <div style={{ display: "grid", gap: 14 }}>
        {dealers.map((d) => (
          <details key={d.id} style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 14, padding: "16px 20px", opacity: d.active ? 1 : 0.55 }}>
            <summary style={{ cursor: "pointer", display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
              <b>{d.name}</b>
              <span style={{ color: "var(--powder)", fontSize: ".88rem" }}>{d.address}, {d.city}</span>
              <span className="mono" style={{ fontSize: ".7rem", color: "var(--glacier)" }}>{d.country}</span>
              {!d.active && <span className="mono" style={{ fontSize: ".7rem", color: "var(--powder)" }}>INACTIEF</span>}
            </summary>
            <form action={updateDealer} style={{ marginTop: 16, display: "grid", gap: 16 }}>
              <input type="hidden" name="id" value={d.id} />
              <DealerFields d={d} />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn small" type="submit">Opslaan</button>
                <button className="btn ghost small" formAction={toggleDealer} name="active" value={String(d.active)}>
                  {d.active ? "Deactiveren" : "Activeren"}
                </button>
                <button className="btn ghost small" formAction={deleteDealer} style={{ borderColor: "#8E2226", color: "#E58" }}>
                  Verwijderen
                </button>
              </div>
            </form>
          </details>
        ))}
      </div>
      <p style={{ color: "var(--powder)", fontSize: ".82rem", marginTop: 28 }}>
        Tip: lat/lng vind je door in Google Maps rechts te klikken op de winkellocatie — de coördinaten staan bovenaan het menu.
      </p>
    </main>
  );
}
