import gsap from "gsap";

export function modalEnter(overlay: HTMLElement | null, content: HTMLElement | null) {
  if (!overlay || !content) return null;

  const tl = gsap.timeline();
  tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
  tl.fromTo(
    content,
    { opacity: 0, scale: 0.92, y: 20 },
    { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.4)" },
    "-=0.1",
  );
  return tl;
}

export function modalExit(overlay: HTMLElement | null, content: HTMLElement | null) {
  if (!overlay || !content) return null;

  const tl = gsap.timeline();
  tl.to(content, { opacity: 0, scale: 0.95, y: 10, duration: 0.25, ease: "power2.in" });
  tl.to(overlay, { opacity: 0, duration: 0.2 }, "-=0.1");
  return tl;
}
