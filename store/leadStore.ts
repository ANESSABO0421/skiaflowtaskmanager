import { create } from "zustand";
import type { Lead, LeadStatus } from "@/types/database";

interface LeadState {
  leads: Lead[];
  statusFilter: LeadStatus | "all";
  searchQuery: string;
  setLeads: (leads: Lead[]) => void;
  setStatusFilter: (filter: LeadStatus | "all") => void;
  setSearchQuery: (query: string) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  removeLead: (id: string) => void;
}

export const useLeadStore = create<LeadState>((set) => ({
  leads: [],
  statusFilter: "all",
  searchQuery: "",
  setLeads: (leads) => set({ leads }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  addLead: (lead) => set((s) => ({ leads: [lead, ...s.leads] })),
  updateLead: (id, updates) =>
    set((s) => ({
      leads: s.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    })),
  removeLead: (id) =>
    set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),
}));

export const selectFilteredLeads = (s: LeadState) => {
  let result = s.leads;
  if (s.statusFilter !== "all") {
    result = result.filter((l) => l.status === s.statusFilter);
  }
  if (s.searchQuery) {
    const q = s.searchQuery.toLowerCase();
    result = result.filter(
      (l) =>
        l.client_name.toLowerCase().includes(q) ||
        l.company_name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q),
    );
  }
  return result;
};
