import { createClient } from "@/lib/supabase/client";

export async function getProfile(userId: string) {
  const supabase = createClient();
  return supabase.from("profiles").select("*").eq("id", userId).single();
}

export async function updateProfile(
  userId: string,
  updates: { full_name?: string; avatar_url?: string },
) {
  const supabase = createClient();
  return supabase.from("profiles").update(updates).eq("id", userId).select().single();
}
