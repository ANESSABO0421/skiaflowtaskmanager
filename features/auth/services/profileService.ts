import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getProfile(userId: string) {
  return supabase.from("profiles").select("*").eq("id", userId).single();
}

export async function updateProfile(
  userId: string,
  updates: { full_name?: string; avatar_url?: string },
) {
  return supabase.from("profiles").update(updates).eq("id", userId).select().single();
}
