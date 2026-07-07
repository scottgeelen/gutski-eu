"use client";
import { useActionState, useEffect, useState } from "react";
import { submitStockistLead, type LeadFormState } from "@/app/actions/stockist";
import type { Dictionary } from "@/lib/dictionaries";

const COUNTRIES = ["NL", "DE", "BE", "AT", "CH", "FR", "IT", "LU"];
const initial: LeadFormState = { status: "idle" };

function StockistForm({ t, onClose }: { t: Dictionary; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(submitStockistLead, initial);

  if (state.status === "ok") {
    return (
      <div className="b2b-success">
        <div className="b2b-check" aria-hidden="true">✓</div>
        <p>{t.b2b_success}</p>
        <button type="button" className="btn" onClick={onClose}>{t.b2b_close}</button>
      </div>
    );
  }

  return (
    <form action={formAction} className="b2b-form" noValidate={false}>
      {/* Honeypot — verborgen voor mensen, ingevuld door bots */}
      <input
        type="text"
        name="website"
        className="b2b-hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <label className="b2b-field">
        <span>{t.b2b_company} *</span>
        <input name="company" required autoComplete="organization" />
      </label>
      <label className="b2b-field">
        <span>{t.b2b_contact} *</span>
        <input name="contact_name" required autoComplete="name" />
      </label>
      <label className="b2b-field">
        <span>{t.b2b_email} *</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label className="b2b-field">
        <span>{t.b2b_phone}</span>
        <input name="phone" type="tel" autoComplete="tel" />
      </label>
      <label className="b2b-field">
        <span>{t.b2b_city}</span>
        <input name="city" autoComplete="address-level2" />
      </label>
      <label className="b2b-field">
        <span>{t.b2b_country}</span>
        <select name="country" defaultValue="">
          <option value="" disabled>{t.b2b_country_ph}</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
          <option value="Overig">{t.b2b_country_other}</option>
        </select>
      </label>
      <label className="b2b-field b2b-full">
        <span>{t.b2b_message}</span>
        <textarea name="message" rows={4} placeholder={t.b2b_message_ph} />
      </label>

      {state.status === "error" && <p className="b2b-error b2b-full">{t.b2b_error}</p>}

      <div className="b2b-actions b2b-full">
        <button type="submit" className="btn" disabled={pending}>
          {pending ? t.b2b_sending : t.b2b_submit}
        </button>
      </div>
    </form>
  );
}

export default function StockistModal({ t }: { t: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [seq, setSeq] = useState(0); // remount de form bij elke opening (frisse state)

  useEffect(() => {
    const opener = () => {
      setSeq((s) => s + 1);
      setOpen(true);
    };
    window.addEventListener("gutski:stockist-open", opener);
    return () => window.removeEventListener("gutski:stockist-open", opener);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="b2b-title">
        <button type="button" className="modal-close" aria-label={t.b2b_close} onClick={() => setOpen(false)}>
          ✕
        </button>
        <h2 id="b2b-title">{t.b2b_title}</h2>
        <p className="modal-intro">{t.b2b_intro}</p>
        <StockistForm key={seq} t={t} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}
