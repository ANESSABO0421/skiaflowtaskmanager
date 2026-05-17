"use client";

import { useEffect, useRef, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { getAnalyticsSummary } from "@/features/analytics/services/analyticsService";
import { animateCounter } from "@/src/animations/dashboardAnimation";
import { Briefcase, Users, DollarSign, CheckSquare } from "lucide-react";

export default function AnalyticsPage() {
  const revenueRef = useRef<HTMLParagraphElement>(null);
  const counterTween = useRef<ReturnType<typeof animateCounter>>(null);
  const [stats, setStats] = useState({
    leadsCount: 0,
    clientsCount: 0,
    paidRevenue: 0,
    tasksCount: 0,
  });

  useEffect(() => {
    let cancelled = false;

    getAnalyticsSummary().then((d) => {
      if (cancelled) return;
      setStats({
        leadsCount: d.leadsCount,
        clientsCount: d.clientsCount,
        paidRevenue: d.paidRevenue,
        tasksCount: d.tasksCount,
      });
      counterTween.current?.kill();
      counterTween.current = animateCounter(revenueRef.current, d.paidRevenue);
    });

    return () => {
      cancelled = true;
      counterTween.current?.kill();
    };
  }, []);

  return (
    <PageWrapper title="Analytics" description="Revenue and performance insights">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Leads" value={stats.leadsCount} icon={Briefcase} />
        <StatCard title="Clients" value={stats.clientsCount} icon={Users} />
        <StatCard title="Tasks" value={stats.tasksCount} icon={CheckSquare} />
        <div className="glass-panel rounded-2xl p-6">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p ref={revenueRef} className="text-3xl font-bold mt-2">
            0
          </p>
          <DollarSign className="h-4 w-4 text-pink-400 mt-2" />
        </div>
      </div>
      <RevenueChart />
    </PageWrapper>
  );
}
