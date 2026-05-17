"use client";

import { useGsapReveal } from "@/hooks/useGsapReveal";
import { usePageTransition } from "@/hooks/usePageTransition";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  animate?: boolean;
}

export default function PageWrapper({
  title,
  description,
  children,
  className,
  actions,
  animate = true,
}: PageWrapperProps) {
  const pageRef = usePageTransition(animate);
  const revealRef = useGsapReveal("[data-reveal]", animate);

  return (
    <div ref={animate ? pageRef : undefined} className={cn("space-y-8", className)}>
      <div
        ref={animate ? revealRef : undefined}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div data-reveal={animate || undefined}>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div data-reveal={animate || undefined}>{actions}</div>}
      </div>
      {children}
    </div>
  );
}
