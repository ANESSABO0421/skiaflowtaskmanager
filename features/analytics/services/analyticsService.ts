import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getAnalyticsSummary() {
  const [leads, clients, projects, invoices, tasks] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase
      .from("invoices")
      .select("amount, status")
      .limit(1000),
    supabase.from("tasks").select("id", { count: "exact", head: true }),
  ]);

  const invoiceRows =
    (invoices.data as { amount: number; status: string }[] | null) ?? [];
  const paidRevenue = invoiceRows
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + Number(i.amount), 0);
  const pendingRevenue = invoiceRows
    .filter((i) => ["sent", "overdue"].includes(i.status))
    .reduce((sum, i) => sum + Number(i.amount), 0);

  return {
    leadsCount: leads.count ?? 0,
    clientsCount: clients.count ?? 0,
    projectsCount: projects.count ?? 0,
    tasksCount: tasks.count ?? 0,
    paidRevenue,
    pendingRevenue,
  };
}
