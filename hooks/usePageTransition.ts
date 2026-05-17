"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { pageTransitionEnter } from "@/src/animations/pageTransition";

gsap.registerPlugin(useGSAP);

export function usePageTransition() {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      pageTransitionEnter(pageRef.current);
    },
    { scope: pageRef },
  );

  return pageRef;
}
