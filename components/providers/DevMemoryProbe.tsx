"use client";

import { useEffect } from "react";

type BrowserPerformance = Performance & {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
};

const MB = 1024 * 1024;

function mb(value: number) {
  return Math.round(value / MB);
}

export default function DevMemoryProbe() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "development" ||
      window.localStorage.getItem("SKIAFLOW_DEBUG_MEMORY") !== "1"
    ) {
      return;
    }

    let cancelled = false;

    const logMemory = async () => {
      const browserMemory = (performance as BrowserPerformance).memory;
      const browser = browserMemory
        ? {
            usedMB: mb(browserMemory.usedJSHeapSize),
            totalMB: mb(browserMemory.totalJSHeapSize),
            limitMB: mb(browserMemory.jsHeapSizeLimit),
          }
        : "performance.memory unavailable";

      try {
        const res = await fetch("/api/debug/memory", { cache: "no-store" });
        const server = res.ok ? await res.json() : { error: res.status };
        if (!cancelled) console.debug("[memory]", { browser, server });
      } catch (error) {
        if (!cancelled) console.debug("[memory]", { browser, server: error });
      }
    };

    void logMemory();
    const id = window.setInterval(logMemory, 15_000);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return null;
}
