import { createClient } from "@/lib/supabase/client";
import { Lead } from "../types/leads.types";

const supabase = createClient();

async function withCurrentUser<T extends { created_by?: string | null }>(record: T) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Please sign in before creating a lead");
  }

  return { ...record, created_by: user.id };
}

export const getLeads = async () => {
  return await supabase.from("leads").select("*").order("created_at", {
    ascending: false,
  });
};

export const createLeads = async (lead: Partial<Lead>) => {
  try {
    // Use server API route so the insert runs with server-side auth context
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: new Error(json.error || "Failed to create lead") };
    }

    return { data: json.data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const updateLeads = async (id: string, updates: Partial<Lead>) => {
  return await supabase.from("leads").update(updates).eq("id", id);
};

export const deleteLeads = async (id: string) => {
  return await supabase.from("leads").delete().eq("id", id);
};
