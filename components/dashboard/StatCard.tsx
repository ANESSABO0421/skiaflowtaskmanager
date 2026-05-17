"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

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
  return (
    <Card
      data-dashboard-card
      className={cn(
        "cursor-default transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]",
        className,
      )}
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
        {change && <p className="mt-1 text-xs text-emerald-400">{change}</p>}
      </CardContent>
    </Card>
  );
}
