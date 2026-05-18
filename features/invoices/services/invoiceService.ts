import { createClient } from "@/lib/supabase/client";
import type { Invoice } from "@/types/database";

export async function getInvoices() {
  const supabase = createClient();
  return supabase
    .from("invoices")
    .select("*, clients(name)")
    .order("created_at", { ascending: false });
}

export async function createInvoice(invoice: Partial<Invoice>) {
  const supabase = createClient();
  return supabase.from("invoices").insert([invoice]).select("*, clients(name)").single();
}

export async function updateInvoice(id: string, updates: Partial<Invoice>) {
  const supabase = createClient();
  return supabase.from("invoices").update(updates).eq("id", id).select().single();
}

export async function deleteInvoice(id: string) {
  const supabase = createClient();
  return supabase.from("invoices").delete().eq("id", id);
}
