import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Dealer, StockistLead } from "@/lib/types";
import { createDealer, updateDealer, toggleDealer, deleteDealer, cycleLeadStatus, signOut } from "./actions";
import LogoMark, { LogoDefs } from "@/components/Logo";
import AdminTabs from "./AdminTabs";
import NewDealer from "./NewDealer";
import DealerCard from "./DealerCard";
import LeadsPanel from "./LeadsPanel";

export const metadata = { title: "GUTSKI Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabase.from("dealers").select("*").order("country").order("city");
  const dealers = (data ?? []) as Dealer[];

  const { data: leadsData } = await supabase
    .from("stockist_leads")
    .select("*")
    .order("created_at", { ascending: false });
  const leads = (leadsData ?? []) as StockistLead[];
  const newLeads = leads.filter((l) => l.status === "new").length;

  // Datum server-side formatteren (voorkomt hydration-mismatch in de client)
  const leadRows = leads.map((l) => ({
    ...l,
    dateLabel: new Date(l.created_at).toLocaleString("nl-NL", { dateStyle: "medium", timeStyle: "short" }),
  }));

  return (
    <div className="adm">
      <LogoDefs />
      <header className="adm-header">
        <div className="adm-header-in">
          <span className="adm-brand">
            <LogoMark />
            GUTSKI <span>Admin</span>
          </span>
          <div className="adm-user">
            <span className="adm-email" title={user.email ?? ""}>{user.email}</span>
            <form action={signOut}>
              <button className="btn ghost small" type="submit">Uitloggen</button>
            </form>
          </div>
        </div>
      </header>

      <main className="adm-main">
        <AdminTabs
          tabs={[
            { label: "Verkooppunten", badge: dealers.length },
            { label: "Aanmeldingen", badge: newLeads },
          ]}
        >
          <div>
            <h1 className="adm-h1">Verkooppunten <span className="adm-badge">{dealers.length}</span></h1>
            <NewDealer action={createDealer} />

            {dealers.length === 0 ? (
              <div className="adm-empty">
                <b>Nog geen verkooppunten</b>
                <span>Voeg je eerste verkooppunt toe met de knop hierboven.</span>
              </div>
            ) : (
              <div className="adm-list">
                {dealers.map((d) => (
                  <DealerCard
                    key={d.id}
                    dealer={d}
                    updateAction={updateDealer}
                    toggleAction={toggleDealer}
                    deleteAction={deleteDealer}
                  />
                ))}
              </div>
            )}
          </div>

          <LeadsPanel leads={leadRows} cycleAction={cycleLeadStatus} />
        </AdminTabs>
      </main>
    </div>
  );
}
