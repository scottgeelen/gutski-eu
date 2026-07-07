"use client";
import { useActionState } from "react";
import type { Dealer } from "@/lib/types";
import type { DealerFormState } from "./actions";

const input = {
  background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 10,
  color: "var(--ice)", padding: "10px 12px", font: "inherit", fontSize: ".9rem", width: "100%",
} as const;
const label = { display: "grid", gap: 6, fontSize: ".78rem", color: "var(--powder)" } as const;

const initial: DealerFormState = { status: "idle" };

export default function DealerForm({
  action,
  dealer,
  submitLabel,
}: {
  action: (prev: DealerFormState, formData: FormData) => Promise<DealerFormState>;
  dealer?: Dealer;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} style={{ marginTop: 16, display: "grid", gap: 16 }}>
      {dealer && <input type="hidden" name="id" value={dealer.id} />}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
        <label style={label}>Naam<input style={input} name="name" defaultValue={dealer?.name} required /></label>
        <label style={label}>Adres<input style={input} name="address" defaultValue={dealer?.address} required /></label>
        <label style={label}>Postcode<input style={input} name="postal_code" defaultValue={dealer?.postal_code ?? ""} /></label>
        <label style={label}>Plaats<input style={input} name="city" defaultValue={dealer?.city} required /></label>
        <label style={label}>Land (ISO-2)<input style={input} name="country" defaultValue={dealer?.country ?? "NL"} maxLength={2} required /></label>
        <label style={label}>Telefoon<input style={input} name="phone" defaultValue={dealer?.phone ?? ""} /></label>
        <label style={label}>Website<input style={input} name="website" defaultValue={dealer?.website ?? ""} /></label>
        <label style={{ ...label, alignSelf: "end", flexDirection: "row" as const }}>
          <span><input name="active" type="checkbox" defaultChecked={dealer ? dealer.active : true} /> Actief</span>
        </label>
      </div>

      <details style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 10, padding: "12px 14px" }}>
        <summary style={{ cursor: "pointer", fontSize: ".82rem", color: "var(--powder)" }}>
          Coördinaten (optioneel — worden automatisch bepaald uit het adres)
        </summary>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <label style={label}>Latitude<input style={input} name="lat" type="number" step="any" defaultValue={dealer?.lat ?? ""} /></label>
          <label style={label}>Longitude<input style={input} name="lng" type="number" step="any" defaultValue={dealer?.lng ?? ""} /></label>
        </div>
      </details>

      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
        <button className="btn" type="submit" disabled={pending} style={{ justifySelf: "start" }}>
          {pending ? "Bezig…" : submitLabel}
        </button>
        {state.status === "ok" && (
          <span style={{ fontSize: ".85rem", color: "var(--powder)", display: "inline-flex", gap: 10, alignItems: "center" }}>
            <span style={{ color: "var(--glacier)" }}>✓ {state.message}</span>
            {state.lat !== undefined && state.lng !== undefined && (
              <a
                href={`https://www.google.com/maps?q=${state.lat},${state.lng}`}
                target="_blank"
                rel="noopener"
                style={{ color: "var(--glacier)", fontWeight: 700 }}
              >
                Controleer op kaart ↗
              </a>
            )}
          </span>
        )}
        {state.status === "error" && (
          <span style={{ fontSize: ".85rem", color: "#E58" }}>{state.message}</span>
        )}
      </div>
    </form>
  );
}
