import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "super_admin" | "devoloper" | "designer" | "client";

interface AuthState {
  user: User | null;
  session: Session | null;
  role: Role | null;

  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setRole: (role: Role) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist((set) => ({
    user: null,
    session: null,
    role: null,

    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    setRole: (role) => set({ role }),

    logout: () =>
        set({
          user: null,
          session: null,
          role: null,
        }),
    }),
    {
      name: 'auth-store',
    }
  )
)
