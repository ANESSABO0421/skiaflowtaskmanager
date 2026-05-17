"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

gsap.registerPlugin(useGSAP);

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  className?: string;
}

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  className,
}: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = cardRef.current;
      if (!el) return;
      const onEnter = () =>
        gsap.to(el, {
          y: -6,
          scale: 1.02,
          duration: 0.35,
          ease: "power2.out",
        });
      const onLeave = () =>
        gsap.to(el, { y: 0, scale: 1, duration: 0.35, ease: "power2.out" });
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: cardRef },
  );

  return (
    <Card
      ref={cardRef}
      data-dashboard-card
      className={cn("cursor-default", className)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/10">
          <Icon className="h-4 w-4 text-pink-400" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        {change && (
          <p className="mt-1 text-xs text-emerald-400">{change}</p>
        )}
      </CardContent>
    </Card>
  );
}
