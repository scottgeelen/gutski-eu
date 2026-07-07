"use client";
import { useActionState } from "react";
import type { Dealer } from "@/lib/types";
import type { DealerFormState } from "./actions";

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
    <form action={formAction} className="adm-form">
      {dealer && <input type="hidden" name="id" value={dealer.id} />}

      <div className="adm-grid">
        <label className="adm-field"><span>Naam <span className="req">*</span></span>
          <input name="name" defaultValue={dealer?.name} required autoComplete="off" />
        </label>
        <label className="adm-field"><span>Adres <span className="req">*</span></span>
          <input name="address" defaultValue={dealer?.address} required autoComplete="off" />
        </label>
        <label className="adm-field"><span>Postcode</span>
          <input name="postal_code" defaultValue={dealer?.postal_code ?? ""} autoComplete="off" />
        </label>
        <label className="adm-field"><span>Plaats <span className="req">*</span></span>
          <input name="city" defaultValue={dealer?.city} required autoComplete="off" />
        </label>
        <label className="adm-field"><span>Land (ISO-2) <span className="req">*</span></span>
          <input name="country" defaultValue={dealer?.country ?? "NL"} maxLength={2} required autoComplete="off" />
        </label>
        <label className="adm-field"><span>Telefoon</span>
          <input name="phone" defaultValue={dealer?.phone ?? ""} autoComplete="off" />
        </label>
        <label className="adm-field"><span>Website</span>
          <input name="website" defaultValue={dealer?.website ?? ""} autoComplete="off" />
        </label>
        <label className="adm-field adm-check">
          <input name="active" type="checkbox" defaultChecked={dealer ? dealer.active : true} /> Actief
        </label>
      </div>

      <details className="adm-adv">
        <summary>Coördinaten (optioneel — worden automatisch bepaald uit het adres)</summary>
        <div className="adm-grid">
          <label className="adm-field"><span>Latitude</span>
            <input name="lat" type="number" step="any" defaultValue={dealer?.lat ?? ""} />
          </label>
          <label className="adm-field"><span>Longitude</span>
            <input name="lng" type="number" step="any" defaultValue={dealer?.lng ?? ""} />
          </label>
        </div>
      </details>

      <div className="adm-formrow">
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Bezig…" : submitLabel}
        </button>
        {state.status === "ok" && (
          <span className="adm-feedback">
            <span className="adm-ok">✓ {state.message}</span>
            {state.lat !== undefined && state.lng !== undefined && (
              <a
                className="adm-ok"
                style={{ fontWeight: 700 }}
                href={`https://www.google.com/maps?q=${state.lat},${state.lng}`}
                target="_blank"
                rel="noopener"
              >
                Controleer op kaart ↗
              </a>
            )}
          </span>
        )}
        {state.status === "error" && <span className="adm-err">{state.message}</span>}
      </div>
    </form>
  );
}
