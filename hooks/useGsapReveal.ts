"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { staggerReveal } from "@/src/animations/staggerReveal";
import { ensureGsapRegistered } from "@/lib/gsap/register";

ensureGsapRegistered();

export function useGsapReveal(selector = "[data-reveal]", enabled = true) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!enabled) return;
      const tl = staggerReveal(containerRef.current, selector);
      return () => {
        tl?.kill();
      };
    },
    { scope: containerRef, dependencies: [enabled] },
  );

  return containerRef;
}
