import { Lead } from '@/features/leads/types/leads.types'
import { create } from 'zustand'

interface LeadState {
  leads: Lead[]

  setLeads: (leads: Lead[]) => void

  addLead: (lead: Lead) => void

  updateLead: (
    id: string,
    updates: Partial<Lead>
  ) => void

  removeLead: (id: string) => void
}

export const useLeadStore =
  create<LeadState>((set) => ({
    leads: [],

    setLeads: (leads) =>
      set({ leads }),

    addLead: (lead) =>
      set((state) => ({
        leads: [lead, ...state.leads],
      })),

    updateLead: (id, updates) =>
      set((state) => ({
        leads: state.leads.map((lead) =>
          lead.id === id
            ? { ...lead, ...updates }
            : lead
        ),
      })),

    removeLead: (id) =>
      set((state) => ({
        leads: state.leads.filter(
          (lead) => lead.id !== id
        ),
      })),
  }))