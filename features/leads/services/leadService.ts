import { createClient } from "@/lib/supabase/client";
import { Lead } from "../types/leads.types";

export const getLeads = async () => {
  const supabase = createClient();
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
  const supabase = createClient();
  return await supabase.from("leads").update(updates).eq("id", id);
};

export const deleteLeads = async (id: string) => {
  const supabase = createClient();
  return await supabase.from("leads").delete().eq("id", id);
};
