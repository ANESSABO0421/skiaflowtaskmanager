import { createClient } from "@/lib/supabase/client";
import type { Client } from "@/types/database";

const supabase = createClient();

async function withCurrentUser<T extends { created_by?: string | null }>(record: T) {
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
  return supabase.from("clients").select("*").order("created_at", { ascending: false });
}

export async function getClientById(id: string) {
  return supabase.from("clients").select("*, projects(*)").eq("id", id).single();
}

export async function createClientRecord(client: Partial<Client>) {
  try {
    const payload = await withCurrentUser(client);
    return supabase.from("clients").insert([payload]).select().single();
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateClient(id: string, updates: Partial<Client>) {
  return supabase.from("clients").update(updates).eq("id", id).select().single();
}

export async function deleteClient(id: string) {
  return supabase.from("clients").delete().eq("id", id);
}
