"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { pageTransitionEnter } from "@/src/animations/pageTransition";
import { ensureGsapRegistered } from "@/lib/gsap/register";

ensureGsapRegistered();

export function usePageTransition(enabled = true) {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!enabled) return;
      const tl = pageTransitionEnter(pageRef.current);
      return () => {
        tl?.kill();
      };
    },
    { scope: pageRef, dependencies: [enabled] },
  );

  return pageRef;
}
