import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getAnalyticsSummary() {
  const [leads, clients, projects, invoices, tasks] = await Promise.all([
    supabase.from("leads").select("id, status, budget", { count: "exact" }),
    supabase.from("clients").select("id", { count: "exact" }),
    supabase.from("projects").select("id, status", { count: "exact" }),
    supabase.from("invoices").select("amount, status"),
    supabase.from("tasks").select("id, status"),
  ]);

  const paidRevenue =
    invoices.data
      ?.filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + Number(i.amount), 0) ?? 0;

  const pendingRevenue =
    invoices.data
      ?.filter((i) => ["sent", "overdue"].includes(i.status))
      .reduce((sum, i) => sum + Number(i.amount), 0) ?? 0;

  return {
    leadsCount: leads.count ?? 0,
    clientsCount: clients.count ?? 0,
    projectsCount: projects.count ?? 0,
    tasksCount: tasks.data?.length ?? 0,
    paidRevenue,
    pendingRevenue,
    leads: leads.data ?? [],
    invoices: invoices.data ?? [],
    tasks: tasks.data ?? [],
  };
}
