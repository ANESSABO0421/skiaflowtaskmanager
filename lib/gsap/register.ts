import gsap from "gsap";
import { useGSAP } from "@gsap/react";

let registered = false;

export function ensureGsapRegistered() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(useGSAP);
  registered = true;
}

export function killTweensOf(target: gsap.TweenTarget | null | undefined) {
  if (target) gsap.killTweensOf(target);
}
