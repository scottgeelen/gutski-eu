"use client";
import { useState } from "react";
import DealerForm from "./DealerForm";
import type { Dealer } from "@/lib/types";
import type { DealerFormState } from "./actions";

const FLAGS: Record<string, string> = {
  NL: "🇳🇱", DE: "🇩🇪", BE: "🇧🇪", AT: "🇦🇹", CH: "🇨🇭", FR: "🇫🇷", IT: "🇮🇹", LU: "🇱🇺",
};

export default function DealerCard({
  dealer,
  updateAction,
  toggleAction,
  deleteAction,
}: {
  dealer: Dealer;
  updateAction: (prev: DealerFormState, formData: FormData) => Promise<DealerFormState>;
  toggleAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className={`adm-card${dealer.active ? "" : " inactive"}`}>
      <div className="adm-drow">
        <div style={{ minWidth: 0 }}>
          <div className="adm-dname">
            <span className="adm-flag" aria-hidden="true">{FLAGS[dealer.country] ?? "🏳️"}</span>
            {dealer.name}
            <span className={`adm-status ${dealer.active ? "active" : "inactive"}`}>
              {dealer.active ? "Actief" : "Inactief"}
            </span>
          </div>
          <div className="adm-daddr">
            {dealer.address}, {dealer.postal_code ? `${dealer.postal_code} ` : ""}{dealer.city} · {dealer.country}
          </div>
        </div>

        <div className="adm-actions">
          <button type="button" className="btn ghost small" onClick={() => setEditing((v) => !v)}>
            {editing ? "Sluiten" : "Bewerken"}
          </button>
          <form action={toggleAction}>
            <input type="hidden" name="id" value={dealer.id} />
            <input type="hidden" name="active" value={String(dealer.active)} />
            <button className="btn ghost small" type="submit">
              {dealer.active ? "Deactiveren" : "Activeren"}
            </button>
          </form>
          {!confirming ? (
            <button type="button" className="btn ghost small danger" onClick={() => setConfirming(true)}>
              Verwijderen
            </button>
          ) : (
            <span className="adm-confirm">
              Zeker weten?
              <form action={deleteAction} style={{ display: "inline" }}>
                <input type="hidden" name="id" value={dealer.id} />
                <button className="btn small solid-danger" type="submit">Ja, verwijderen</button>
              </form>
              <button type="button" className="btn ghost small" onClick={() => setConfirming(false)}>
                Annuleren
              </button>
            </span>
          )}
        </div>
      </div>

      {editing && (
        <div className="adm-formwrap">
          <DealerForm action={updateAction} dealer={dealer} submitLabel="Opslaan" />
        </div>
      )}
    </div>
  );
}
