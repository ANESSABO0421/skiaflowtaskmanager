import { createClient } from "@/lib/supabase/client";
import type { Task, TaskStatus } from "@/types/database";

const supabase = createClient();

export async function getTasks(projectId?: string) {
  let query = supabase
    .from("tasks")
    .select("*, profiles:assignee_id(full_name, avatar_url)")
    .order("position", { ascending: true });

  if (projectId) query = query.eq("project_id", projectId);
  return query;
}

export async function createTask(task: Partial<Task>) {
  return supabase.from("tasks").insert([task]).select().single();
}

export async function updateTask(id: string, updates: Partial<Task>) {
  return supabase.from("tasks").update(updates).eq("id", id).select().single();
}

export async function deleteTask(id: string) {
  return supabase.from("tasks").delete().eq("id", id);
}

export async function moveTask(
  id: string,
  status: TaskStatus,
  position: number,
) {
  return updateTask(id, { status, position });
}
