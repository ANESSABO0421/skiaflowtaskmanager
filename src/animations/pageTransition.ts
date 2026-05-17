import gsap from "gsap";

export function pageTransitionEnter(container: HTMLElement | null) {
  if (!container) return null;

  const tl = gsap.timeline();
  tl.fromTo(
    container,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
  );
  return tl;
}

export function pageTransitionExit(container: HTMLElement | null) {
  if (!container) return null;

  return gsap.to(container, {
    opacity: 0,
    y: -12,
    duration: 0.35,
    ease: "power2.in",
  });
}
