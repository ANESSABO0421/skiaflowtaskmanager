import gsap from "gsap";

export function animateSidebarExpand(sidebar: HTMLElement | null) {
  if (!sidebar) return null;

  return gsap.to(sidebar, {
    width: 260,
    duration: 0.4,
    ease: "power3.inOut",
  });
}

export function animateSidebarCollapse(sidebar: HTMLElement | null) {
  if (!sidebar) return null;

  return gsap.to(sidebar, {
    width: 72,
    duration: 0.4,
    ease: "power3.inOut",
  });
}

export function staggerNavItems(nav: HTMLElement | null) {
  if (!nav) return null;

  const items = nav.querySelectorAll("[data-nav-item]");
  return gsap.fromTo(
    items,
    { opacity: 0, x: -16 },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out",
    },
  );
}
