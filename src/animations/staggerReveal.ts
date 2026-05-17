import gsap from "gsap";

export function staggerReveal(
  container: HTMLElement | null,
  selector = "[data-reveal]",
  options?: { stagger?: number; y?: number },
) {
  if (!container) return null;

  const items = container.querySelectorAll(selector);
  if (!items.length) return null;

  gsap.killTweensOf(items);
  const { stagger = 0.06, y = 32 } = options ?? {};

  return gsap.fromTo(
    items,
    { opacity: 0, y, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.65,
      stagger,
      ease: "power3.out",
    },
  );
}
