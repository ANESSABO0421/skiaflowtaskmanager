import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, UserRole } from "@/types/database";

interface AuthState {
  user: Pick<User, "id" | "email"> | null;
  profile: Profile | null;
  role: UserRole | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setRole: (role: UserRole | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      role: null,
      setUser: (user) =>
        set({
          user: user ? { id: user.id, email: user.email } : null,
        }),
      setProfile: (profile) =>
        set({ profile, role: profile?.role ?? null }),
      setRole: (role) => set({ role }),
      logout: () => set({ user: null, profile: null, role: null }),
    }),
    {
      name: "skiaflow-auth",
      partialize: (s) => ({
        user: s.user,
        role: s.role,
        profile: s.profile
          ? {
              id: s.profile.id,
              full_name: s.profile.full_name,
              role: s.profile.role,
            }
          : null,
      }),
    },
  ),
);

export const selectUser = (s: AuthState) => s.user;
export const selectRole = (s: AuthState) => s.role;
