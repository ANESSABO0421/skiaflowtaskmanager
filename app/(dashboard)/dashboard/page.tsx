"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { Briefcase, Users, FolderKanban, DollarSign } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { getAnalyticsSummary } from "@/features/analytics/services/analyticsService";
import { animateDashboardCards } from "@/src/animations/dashboardAnimation";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ensureGsapRegistered } from "@/lib/gsap/register";

ensureGsapRegistered();

export default function DashboardPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    leadsCount: 0,
    clientsCount: 0,
    projectsCount: 0,
    paidRevenue: 0,
  });

  useEffect(() => {
    let cancelled = false;

    getAnalyticsSummary().then((data) => {
      if (cancelled) return;
      setStats({
        leadsCount: data.leadsCount,
        clientsCount: data.clientsCount,
        projectsCount: data.projectsCount,
        paidRevenue: data.paidRevenue,
      });
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useGSAP(
    () => {
      if (loading) return;
      const tl = animateDashboardCards(gridRef.current);
      return () => {
        tl?.kill();
      };
    },
    { scope: gridRef, dependencies: [loading] },
  );

  return (
    <PageWrapper
      title="Dashboard"
      description="Overview of your freelance operations"
      animate={false}
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div ref={gridRef} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard title="Total Leads" value={stats.leadsCount} icon={Briefcase} />
            <StatCard title="Clients" value={stats.clientsCount} icon={Users} />
            <StatCard title="Projects" value={stats.projectsCount} icon={FolderKanban} />
            <StatCard
              title="Revenue"
              value={formatCurrency(stats.paidRevenue)}
              icon={DollarSign}
              change="+12% this month"
            />
          </div>
          <RevenueChart />
        </div>
      )}
    </PageWrapper>
  );
}
