import { createBrowserClient } from "@supabase/ssr";

type SupabaseClient = ReturnType<typeof createBrowserClient>;

declare global {
  // Store one browser client across Fast Refresh in development.
  var __skiaflow_supabase_client: SupabaseClient | undefined;
}

export const createClient = () => {
  if (typeof window === "undefined") {
    throw new Error(
      "createClient() is browser-only. Use createServerSupabaseClient() in server code.",
    );
  }

  if (!globalThis.__skiaflow_supabase_client) {
    globalThis.__skiaflow_supabase_client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  return globalThis.__skiaflow_supabase_client;
};
