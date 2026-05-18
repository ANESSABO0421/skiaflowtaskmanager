"use client";

import { useEffect, useRef } from "react";

function isRenderDebugEnabled() {
  return (
    process.env.NODE_ENV === "development" &&
    typeof window !== "undefined" &&
    window.localStorage.getItem("SKIAFLOW_DEBUG_RENDERS") === "1"
  );
}

export function useRenderDebug(name: string, warnEvery = 25) {
  const countRef = useRef(0);

  useEffect(() => {
    if (!isRenderDebugEnabled()) return;

    countRef.current += 1;
    if (countRef.current === 1 || countRef.current % warnEvery === 0) {
      console.debug(`[render:${name}]`, countRef.current);
    }
  });
}
