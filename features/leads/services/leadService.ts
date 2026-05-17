import { createClient } from "@/lib/supabase/client";
import { Lead } from "../types/leads.types";

const supabase = createClient();

export const getLeads = async () => {
  return await supabase.from("leads").select("*").order("created_at", {
    ascending: false,
  });
};

export const createLeads = async (lead: Partial<Lead>) => {
  return await supabase.from("leads").insert([lead]);
};

export const updateLeads = async (id: string, updates: Partial<Lead>) => {
  return await supabase.from("leads").update(updates).eq("id", id);
};

export const deleteLeads = async (id: string) => {
  return await supabase.from("leads").delete().eq("id", id);
};
