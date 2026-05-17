import gsap from "gsap";

export function animateDashboardCards(container: HTMLElement | null) {
  if (!container) return null;

  const cards = container.querySelectorAll("[data-dashboard-card]");
  if (!cards.length) return null;

  gsap.killTweensOf(cards);
  return gsap.fromTo(
    cards,
    { opacity: 0, y: 28, scale: 0.97 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
    },
  );
}

export function animateCounter(
  element: HTMLElement | null,
  endValue: number,
  duration = 1.5,
) {
  if (!element) return null;

  gsap.killTweensOf(element);
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toLocaleString();
    },
  });
}
