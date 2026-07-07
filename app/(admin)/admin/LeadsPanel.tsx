"use client";
import { useState } from "react";
import type { StockistLead } from "@/lib/types";

const FLAGS: Record<string, string> = {
  NL: "🇳🇱", DE: "🇩🇪", BE: "🇧🇪", AT: "🇦🇹", CH: "🇨🇭", FR: "🇫🇷", IT: "🇮🇹", LU: "🇱🇺",
};

type Row = StockistLead & { dateLabel: string };
type Filter = "all" | "new" | "contacted" | "done";

const STATUS_LABEL: Record<StockistLead["status"], string> = {
  new: "Nieuw",
  contacted: "Gecontacteerd",
  done: "Afgehandeld",
};
const FILTER_LABEL: Record<Filter, string> = {
  all: "Alle",
  new: "Nieuw",
  contacted: "Gecontacteerd",
  done: "Afgehandeld",
};
const nextLabel = (s: StockistLead["status"]) =>
  s === "new" ? "gecontacteerd" : s === "contacted" ? "afgehandeld" : "nieuw";

function LeadCard({ lead, cycleAction }: { lead: Row; cycleAction: (f: FormData) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const msg = lead.message ?? "";
  const long = msg.length > 160;
  const shown = !long || open ? msg : msg.slice(0, 160).trimEnd() + "…";

  return (
    <div className="adm-card">
      <div className="adm-lead-top">
        <div className="adm-dname">
          {lead.country && <span className="adm-flag" aria-hidden="true">{FLAGS[lead.country] ?? "🏳️"}</span>}
          {lead.company}
        </div>
        <span className={`adm-status ${lead.status}`}>{STATUS_LABEL[lead.status]}</span>
      </div>
      <div className="adm-lead-meta">
        <span>
          {lead.contact_name} · <a href={`mailto:${lead.email}`}>{lead.email}</a>
          {lead.phone ? ` · ${lead.phone}` : ""}
        </span>
        <span>{[lead.city, lead.country].filter(Boolean).join(", ") || "—"}</span>
        <span className="mono" style={{ fontSize: ".7rem" }}>{lead.dateLabel}</span>
      </div>
      {msg && <div className="adm-msg">{shown}</div>}
      {long && (
        <button type="button" className="adm-more" onClick={() => setOpen((v) => !v)}>
          {open ? "Minder tonen" : "Meer tonen"}
        </button>
      )}
      <div className="adm-formrow" style={{ marginTop: 12 }}>
        <form action={cycleAction}>
          <input type="hidden" name="id" value={lead.id} />
          <input type="hidden" name="status" value={lead.status} />
          <button className="btn ghost small" type="submit">Markeer als {nextLabel(lead.status)}</button>
        </form>
      </div>
    </div>
  );
}

export default function LeadsPanel({
  leads,
  cycleAction,
}: {
  leads: Row[];
  cycleAction: (f: FormData) => Promise<void>;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const counts: Record<Filter, number> = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    done: leads.filter((l) => l.status === "done").length,
  };
  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div>
      <h1 className="adm-h1">Aanmeldingen <span className="adm-badge">{leads.length}</span></h1>

      <div className="adm-filters" role="tablist" aria-label="Filter op status">
        {(Object.keys(FILTER_LABEL) as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            className={`adm-filter${filter === f ? " on" : ""}`}
            onClick={() => setFilter(f)}
          >
            {FILTER_LABEL[f]} <span className="adm-badge">{counts[f]}</span>
          </button>
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="adm-empty">
          <b>Nog geen aanmeldingen</b>
          <span>Aanmeldingen via het “Word verkooppunt”-formulier verschijnen hier.</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-empty">
          <b>Niets in deze status</b>
          <span>Er zijn geen aanmeldingen met status “{FILTER_LABEL[filter]}”.</span>
        </div>
      ) : (
        <div className="adm-list">
          {filtered.map((l) => (
            <LeadCard key={l.id} lead={l} cycleAction={cycleAction} />
          ))}
        </div>
      )}
    </div>
  );
}
