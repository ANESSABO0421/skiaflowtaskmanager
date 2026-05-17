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
}

export default function PageWrapper({
  title,
  description,
  children,
  className,
  actions,
}: PageWrapperProps) {
  const pageRef = usePageTransition();
  const revealRef = useGsapReveal();

  return (
    <div ref={pageRef} className={cn("space-y-8", className)}>
      <div
        ref={revealRef}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div data-reveal>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div data-reveal>{actions}</div>}
      </div>
      {children}
    </div>
  );
}
