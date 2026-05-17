import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, UserRole } from "@/types/database";

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setRole: (role: UserRole | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      profile: null,
      role: null,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setProfile: (profile) =>
        set({ profile, role: profile?.role ?? null }),
      setRole: (role) => set({ role }),
      logout: () =>
        set({ user: null, session: null, profile: null, role: null }),
    }),
    { name: "skiaflow-auth" },
  ),
);

export const selectUser = (s: AuthState) => s.user;
export const selectRole = (s: AuthState) => s.role;
