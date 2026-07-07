"use server";
import { createClient } from "@/lib/supabase/server";

export type LeadFormState = { status: "idle" | "ok" | "error" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Lead = {
  company: string;
  contact_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  message: string | null;
};

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

/** Stuurt een e-mailnotificatie via Resend. Faalt NOOIT hard: ontbreekt de
 *  key of gaat het mis, dan loggen we een waarschuwing en gaan we door. */
async function notify(lead: Lead) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[stockist] RESEND_API_KEY ontbreekt — mailnotificatie overgeslagen.");
    return;
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    const rows: [string, string][] = [
      ["Bedrijf", lead.company],
      ["Contactpersoon", lead.contact_name],
      ["E-mail", lead.email],
      ["Telefoon", lead.phone || "—"],
      ["Plaats", lead.city || "—"],
      ["Land", lead.country || "—"],
      ["Bericht", lead.message || "—"],
    ];
    const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
    const html =
      `<h2 style="font-family:sans-serif">Nieuwe verkooppunt-aanmelding</h2>` +
      `<table style="font-family:sans-serif;border-collapse:collapse">` +
      rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top"><b>${esc(k)}</b></td>` +
            `<td style="padding:4px 0">${esc(v).replace(/\n/g, "<br>")}</td></tr>`
        )
        .join("") +
      `</table>`;

    await resend.emails.send({
      from: "GUTSKI website <noreply@gutski.eu>",
      to: "scott@sport2000parkstad.nl",
      replyTo: lead.email,
      subject: `Nieuwe verkooppunt-aanmelding: ${lead.company}`,
      text,
      html,
    });
  } catch (e) {
    console.warn("[stockist] Resend-mail mislukt:", e);
  }
}

export async function submitStockistLead(
  _prev: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  // Honeypot: is het verborgen veld gevuld, dan is het een bot — stil negeren
  // en doen alsof het gelukt is.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "ok" };
  }

  const company = String(formData.get("company") ?? "").trim();
  const contact_name = String(formData.get("contact_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const lead: Lead = {
    company,
    contact_name,
    email,
    phone: String(formData.get("phone") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim() || null,
    country: String(formData.get("country") ?? "").trim() || null,
    message: String(formData.get("message") ?? "").trim() || null,
  };

  if (!company || !contact_name || !EMAIL_RE.test(email)) {
    return { status: "error" };
  }

  // Supabase-insert is leidend: lukt die, dan is de aanmelding binnen.
  const supabase = await createClient();
  const { error } = await supabase.from("stockist_leads").insert({ ...lead, status: "new" });
  if (error) {
    console.error("[stockist] insert mislukt:", error.message);
    return { status: "error" };
  }

  // Mail is bijzaak — mag de succesmelding nooit blokkeren.
  await notify(lead);

  return { status: "ok" };
}
