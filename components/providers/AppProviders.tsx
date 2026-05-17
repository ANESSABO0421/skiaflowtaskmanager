"use client";

import { Toaster } from "sonner";
import AuthProvider from "@/components/providers/AuthProvider";
import QueryProvider from "@/components/providers/QueryProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            classNames: {
              toast: "glass-panel border-white/10",
            },
          }}
        />
      </AuthProvider>
    </QueryProvider>
  );
}
