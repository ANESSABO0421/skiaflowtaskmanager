import gsap from "gsap";

export function fadeUp(
  elements: gsap.TweenTarget,
  options?: { delay?: number; duration?: number; y?: number },
) {
  const { delay = 0, duration = 0.7, y = 40 } = options ?? {};

  return gsap.fromTo(
    elements,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: "power3.out",
      stagger: 0.08,
    },
  );
}
