"use server";
import { createClient } from "@/lib/supabase/server";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";

export type LeadFormState = { status: "idle" | "ok" | "error" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// In Resend is het domein gutski.eu geverifieerd; send.gutski.eu is enkel het
// interne bounce-subdomein. Afzender moet dus op gutski.eu staan.
const FROM = "GUTSKI <noreply@gutski.eu>";
const NOTIFY_TO = "scott@sport2000parkstad.nl";
const REPLY_TO = "info@gutski.eu"; // Cloudflare Email Routing → Scott

type Lead = {
  company: string;
  contact_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  message: string | null;
};

type Resend = InstanceType<typeof import("resend").Resend>;

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

/** Notificatie aan Scott — reply gaat naar de aanmelder zelf. */
async function notifyScott(resend: Resend, lead: Lead) {
  try {
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

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: lead.email,
      subject: `Nieuwe verkooppunt-aanmelding: ${lead.company}`,
      text,
      html,
    });
    if (error) {
      console.error(
        "[stockist] notificatiemail aan Scott geweigerd door Resend:",
        JSON.stringify({ name: error.name, message: error.message, statusCode: (error as { statusCode?: number }).statusCode })
      );
    } else {
      console.info(`[stockist] notificatiemail aan Scott verstuurd (id ${data?.id ?? "?"})`);
    }
  } catch (e) {
    console.error("[stockist] notificatiemail aan Scott — uitzondering bij verzenden:", e);
  }
}

/** Bevestiging aan de aanmelder, in de taal van het formulier. */
async function confirmToApplicant(resend: Resend, lead: Lead, t: Dictionary) {
  try {
    const summary: [string, string][] = [
      [t.b2b_company, lead.company],
      [t.b2b_contact, lead.contact_name],
      [t.b2b_city, lead.city || "—"],
    ];

    const text =
      `${t.b2b_confirm_heading}\n\n${t.b2b_confirm_intro}\n\n` +
      `${t.b2b_confirm_received}\n` +
      summary.map(([k, v]) => `- ${k}: ${v}`).join("\n") +
      `\n\n${t.b2b_confirm_outro}\n\n${t.b2b_confirm_signoff}\ngutski.eu · skipullies.com`;

    const rows = summary
      .map(
        ([k, v]) =>
          `<tr><td style="padding:8px 14px;color:#9DBBDA;width:42%;vertical-align:top">${esc(k)}</td>` +
          `<td style="padding:8px 14px;color:#EAF2FC">${esc(v)}</td></tr>`
      )
      .join("");

    const html =
      `<!doctype html><html><body style="margin:0;padding:0;background:#0A1322">` +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A1322;font-family:Arial,Helvetica,sans-serif">` +
      `<tr><td align="center" style="padding:32px 16px">` +
      `<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#0F1D31;border:1px solid rgba(157,187,218,.2);border-radius:14px">` +
      `<tr><td style="padding:26px 28px 6px">` +
      `<div style="font-size:20px;font-weight:bold;letter-spacing:2px;color:#EAF2FC">GUT<span style="color:#5FB2FF">SKI</span></div>` +
      `</td></tr>` +
      `<tr><td style="padding:6px 28px 26px">` +
      `<h1 style="margin:12px 0 10px;font-size:20px;color:#EAF2FC">${esc(t.b2b_confirm_heading)}</h1>` +
      `<p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#9DBBDA">${esc(t.b2b_confirm_intro)}</p>` +
      `<p style="margin:0 0 8px;font-size:13px;color:#9DBBDA">${esc(t.b2b_confirm_received)}</p>` +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;background:#13253E;border-radius:10px">${rows}</table>` +
      `<p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#9DBBDA">${esc(t.b2b_confirm_outro)}</p>` +
      `<p style="margin:18px 0 0;font-size:14px;color:#EAF2FC"><b>${esc(t.b2b_confirm_signoff)}</b><br>` +
      `<a href="https://www.gutski.eu" style="color:#5FB2FF;text-decoration:none">gutski.eu</a> · ` +
      `<a href="https://skipullies.com" style="color:#5FB2FF;text-decoration:none">skipullies.com</a></p>` +
      `</td></tr></table></td></tr></table></body></html>`;

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: lead.email,
      replyTo: REPLY_TO,
      subject: t.b2b_confirm_subject,
      text,
      html,
    });
    if (error) {
      console.error(
        "[stockist] bevestigingsmail aan aanmelder geweigerd door Resend:",
        JSON.stringify({ name: error.name, message: error.message, statusCode: (error as { statusCode?: number }).statusCode })
      );
    } else {
      console.info(`[stockist] bevestigingsmail aan aanmelder verstuurd (id ${data?.id ?? "?"})`);
    }
  } catch (e) {
    console.error("[stockist] bevestigingsmail aan aanmelder — uitzondering bij verzenden:", e);
  }
}

/** Verstuurt beide mails onafhankelijk. Faalt NOOIT hard: ontbreekt de key of
 *  gaat een van beide mis, dan loggen we en gaan we door. */
async function sendMails(lead: Lead, locale: Locale) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[stockist] RESEND_API_KEY ontbreekt — mails overgeslagen.");
    return;
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    const t = await getDictionary(locale);
    // allSettled: de ene mail blokkeert de andere niet.
    await Promise.allSettled([
      notifyScott(resend, lead),
      confirmToApplicant(resend, lead, t),
    ]);
  } catch (e) {
    console.warn("[stockist] mailverzending mislukt:", e);
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

  const localeRaw = String(formData.get("locale") ?? "");
  const locale: Locale = isLocale(localeRaw) ? localeRaw : defaultLocale;

  // Supabase-insert is leidend: lukt die, dan is de aanmelding binnen.
  const supabase = await createClient();
  const { error } = await supabase.from("stockist_leads").insert({ ...lead, status: "new" });
  if (error) {
    console.error("[stockist] insert mislukt:", error.message);
    return { status: "error" };
  }

  // Mails zijn bijzaak — mogen de succesmelding nooit blokkeren.
  await sendMails(lead, locale);

  return { status: "ok" };
}
