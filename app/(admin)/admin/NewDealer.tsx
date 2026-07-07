"use client";
import { useState } from "react";
import DealerForm from "./DealerForm";
import type { DealerFormState } from "./actions";

export default function NewDealer({
  action,
}: {
  action: (prev: DealerFormState, formData: FormData) => Promise<DealerFormState>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="adm-new">
      <button type="button" className={open ? "btn ghost" : "btn"} onClick={() => setOpen((v) => !v)}>
        {open ? "Annuleren" : "+ Nieuw verkooppunt"}
      </button>
      {open && (
        <div className="adm-newpanel">
          <p className="adm-hint">
            Vul naam, adres, postcode, plaats en land in — de coördinaten worden automatisch bepaald bij opslaan.
          </p>
          <DealerForm action={action} submitLabel="Toevoegen" />
        </div>
      )}
    </div>
  );
}
