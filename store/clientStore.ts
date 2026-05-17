import { create } from "zustand";
import type { Client } from "@/types/database";

const MAX_CLIENTS = 500;

interface ClientState {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  removeClient: (id: string) => void;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  setClients: (clients) => set({ clients: clients.slice(0, MAX_CLIENTS) }),
  addClient: (client) =>
    set((s) => ({ clients: [client, ...s.clients].slice(0, MAX_CLIENTS) })),
  updateClient: (id, updates) =>
    set((s) => ({
      clients: s.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  removeClient: (id) =>
    set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),
}));
