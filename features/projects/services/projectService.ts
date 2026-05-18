import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types/database";

async function withCurrentUser<T extends { created_by?: string | null }>(record: T) {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Please sign in before creating a project");
  }

  return { ...record, created_by: user.id };
}

export async function getProjects() {
  const supabase = createClient();
  return supabase
    .from("projects")
    .select("*, clients(name, company)")
    .order("created_at", { ascending: false });
}

export async function getProjectById(id: string) {
  const supabase = createClient();
  return supabase
    .from("projects")
    .select("*, clients(name, company, email), project_members(*, profiles(full_name, avatar_url))")
    .eq("id", id)
    .single();
}

export async function createProject(project: Partial<Project>) {
  try {
    const supabase = createClient();
    const payload = await withCurrentUser(project);
    return supabase.from("projects").insert([payload]).select("*, clients(name)").single();
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const supabase = createClient();
  return supabase.from("projects").update(updates).eq("id", id).select().single();
}

export async function deleteProject(id: string) {
  const supabase = createClient();
  return supabase.from("projects").delete().eq("id", id);
}
