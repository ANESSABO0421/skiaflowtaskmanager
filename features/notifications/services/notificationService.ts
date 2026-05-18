import { createClient } from "@/lib/supabase/client";

export async function getNotifications(userId: string) {
  const supabase = createClient();
  return supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
}

export async function markNotificationRead(id: string) {
  const supabase = createClient();
  return supabase.from("notifications").update({ read: true }).eq("id", id);
}

export async function markAllNotificationsRead(userId: string) {
  const supabase = createClient();
  return supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
}
