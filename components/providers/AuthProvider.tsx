"use client";

import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { getProfile } from "@/features/auth/services/profileService";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const setProfile = useAuthStore((s) => s.setProfile);
  const profileFetchId = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    const loadSession = async (session: Session | null) => {
      if (cancelled) return;

      setUser(session?.user ?? null);

      if (!session?.user) {
        setProfile(null);
        return;
      }

      const fetchId = ++profileFetchId.current;
      const { data: profile } = await getProfile(session.user.id);
      if (cancelled || fetchId !== profileFetchId.current) return;
      if (profile) setProfile(profile);
    };

    void (async () => {
      const { data } = await supabase.auth.getSession();
      await loadSession(data.session);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        void loadSession(session);
      },
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [setUser, setProfile]);

  return <>{children}</>;
}
