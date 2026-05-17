"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { staggerReveal } from "@/src/animations/staggerReveal";

gsap.registerPlugin(useGSAP);

export function useGsapReveal(selector = "[data-reveal]") {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      staggerReveal(containerRef.current, selector);
    },
    { scope: containerRef, dependencies: [] },
  );

  return containerRef;
}
