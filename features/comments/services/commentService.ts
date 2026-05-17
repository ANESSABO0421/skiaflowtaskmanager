import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getComments(projectId: string) {
  return supabase
    .from("comments")
    .select("*, profiles(full_name, avatar_url)")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
}

export async function createComment(data: {
  project_id: string;
  task_id?: string;
  user_id: string;
  content: string;
}) {
  return supabase.from("comments").insert([data]).select("*, profiles(full_name, avatar_url)").single();
}
