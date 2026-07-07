import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Dealer } from "@/lib/types";
import { createDealer, updateDealer, toggleDealer, deleteDealer, signOut } from "./actions";
import DealerForm from "./DealerForm";

export const metadata = { title: "GUTSKI Admin — Verkooppunten", robots: { index: false } };
export const dynamic = "force-dynamic";

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
        <p style={{ color: "var(--powder)", fontSize: ".82rem", margin: "12px 0 0" }}>
          Vul naam, adres, postcode, plaats en land in — de coördinaten worden automatisch bepaald bij opslaan.
        </p>
        <DealerForm action={createDealer} submitLabel="Toevoegen" />
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

            <DealerForm action={updateDealer} dealer={d} submitLabel="Opslaan" />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <form action={toggleDealer}>
                <input type="hidden" name="id" value={d.id} />
                <input type="hidden" name="active" value={String(d.active)} />
                <button className="btn ghost small" type="submit">
                  {d.active ? "Deactiveren" : "Activeren"}
                </button>
              </form>
              <form action={deleteDealer}>
                <input type="hidden" name="id" value={d.id} />
                <button className="btn ghost small" type="submit" style={{ borderColor: "#8E2226", color: "#E58" }}>
                  Verwijderen
                </button>
              </form>
            </div>
          </details>
        ))}
      </div>

      <p style={{ color: "var(--powder)", fontSize: ".82rem", marginTop: 28 }}>
        Coördinaten worden automatisch uit het adres bepaald (OpenStreetMap). Klopt een pin niet? Open dan de
        sectie “Coördinaten” en corrigeer ze handmatig.
      </p>
    </main>
  );
}
