"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef } from "react";

const supabase = createClient();

export function useRealtime<T extends { id: string }>(
  table: string,
  filter: string | undefined,
  onInsert?: (payload: T) => void,
  onUpdate?: (payload: T) => void,
  onDelete?: (payload: { id: string }) => void,
) {
  const onInsertRef = useRef(onInsert);
  const onUpdateRef = useRef(onUpdate);
  const onDeleteRef = useRef(onDelete);

  onInsertRef.current = onInsert;
  onUpdateRef.current = onUpdate;
  onDeleteRef.current = onDelete;

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}-${filter ?? "all"}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table, filter },
        (payload: {
          eventType: "INSERT" | "UPDATE" | "DELETE";
          new: T;
          old: { id: string };
        }) => {
          if (payload.eventType === "INSERT") onInsertRef.current?.(payload.new as T);
          if (payload.eventType === "UPDATE") onUpdateRef.current?.(payload.new as T);
          if (payload.eventType === "DELETE")
            onDeleteRef.current?.(payload.old as { id: string });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [table, filter]);
}
