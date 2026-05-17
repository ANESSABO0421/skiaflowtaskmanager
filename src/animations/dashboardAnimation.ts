import gsap from "gsap";

export function animateDashboardCards(container: HTMLElement | null) {
  if (!container) return null;

  const cards = container.querySelectorAll("[data-dashboard-card]");
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

export function cardHoverLift(card: HTMLElement | null, isHover: boolean) {
  if (!card) return null;

  return gsap.to(card, {
    y: isHover ? -6 : 0,
    scale: isHover ? 1.02 : 1,
    boxShadow: isHover
      ? "0 20px 40px rgba(236, 72, 153, 0.15)"
      : "0 4px 20px rgba(0, 0, 0, 0.2)",
    duration: 0.35,
    ease: "power2.out",
  });
}
