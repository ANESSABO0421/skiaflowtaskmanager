"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

const supabase = createClient();

export function useRealtime<T extends { id: string }>(
  table: string,
  filter: string | undefined,
  onInsert?: (payload: T) => void,
  onUpdate?: (payload: T) => void,
  onDelete?: (payload: { id: string }) => void,
) {
  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}-${filter ?? "all"}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter,
        },
        (payload) => {
          if (payload.eventType === "INSERT" && onInsert) {
            onInsert(payload.new as T);
          }
          if (payload.eventType === "UPDATE" && onUpdate) {
            onUpdate(payload.new as T);
          }
          if (payload.eventType === "DELETE" && onDelete) {
            onDelete(payload.old as { id: string });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, onInsert, onUpdate, onDelete]);
}
