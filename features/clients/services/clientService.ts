import { createClient } from "@/lib/supabase/client";
import type { Client } from "@/types/database";

async function withCurrentUser<T extends { created_by?: string | null }>(record: T) {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Please sign in before creating a client");
  }

  return { ...record, created_by: user.id };
}

export async function getClients() {
  const supabase = createClient();
  return supabase.from("clients").select("*").order("created_at", { ascending: false });
}

export async function getClientById(id: string) {
  const supabase = createClient();
  return supabase.from("clients").select("*, projects(*)").eq("id", id).single();
}

export async function createClientRecord(client: Partial<Client>) {
  try {
    const supabase = createClient();
    const payload = await withCurrentUser(client);
    return supabase.from("clients").insert([payload]).select().single();
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateClient(id: string, updates: Partial<Client>) {
  const supabase = createClient();
  return supabase.from("clients").update(updates).eq("id", id).select().single();
}

export async function deleteClient(id: string) {
  const supabase = createClient();
  return supabase.from("clients").delete().eq("id", id);
}
