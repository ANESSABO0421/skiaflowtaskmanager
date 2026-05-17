import { createBrowserClient } from "@supabase/ssr";

type SupabaseClient = ReturnType<typeof createBrowserClient>;

declare global {
    // store a client on the global object to survive HMR in dev
    // eslint-disable-next-line no-var
    var __skiaflow_supabase_client: SupabaseClient | undefined;
}

export const createClient = () => {
    if (typeof window === "undefined") {
        return createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
    }

    const g = globalThis as any;
    if (!g.__skiaflow_supabase_client) {
        g.__skiaflow_supabase_client = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
    }

    return g.__skiaflow_supabase_client as SupabaseClient;
};