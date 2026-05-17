"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { getProfile } from "@/features/auth/services/profileService";

const supabase = createClient();

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const setSession = useAuthStore((s) => s.setSession);
  const setProfile = useAuthStore((s) => s.setProfile);

  useEffect(() => {
    const loadSession = async (session: Awaited<
      ReturnType<typeof supabase.auth.getSession>
    >["data"]["session"]) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await getProfile(session.user.id);
        if (profile) setProfile(profile);
      } else {
        setProfile(null);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => loadSession(session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setUser, setProfile]);

  return <>{children}</>;
}
