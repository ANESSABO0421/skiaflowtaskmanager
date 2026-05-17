"use client";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import PageWrapper from "@/components/layout/PageWrapper";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { getAnalyticsSummary } from "@/features/analytics/services/analyticsService";
import { animateCounter } from "@/src/animations/dashboardAnimation";
import { Briefcase, Users, DollarSign, CheckSquare } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export default function AnalyticsPage() {
  const revenueRef = useRef<HTMLParagraphElement>(null);
  const [stats, setStats] = useState({ leadsCount: 0, clientsCount: 0, paidRevenue: 0, tasksCount: 0 });

  useEffect(() => {
    getAnalyticsSummary().then((d) => {
      setStats({ leadsCount: d.leadsCount, clientsCount: d.clientsCount, paidRevenue: d.paidRevenue, tasksCount: d.tasksCount });
      animateCounter(revenueRef.current, d.paidRevenue);
    });
  }, []);

  return (
    <PageWrapper title="Analytics" description="Revenue and performance insights">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Leads" value={stats.leadsCount} icon={Briefcase} />
        <StatCard title="Clients" value={stats.clientsCount} icon={Users} />
        <StatCard title="Tasks" value={stats.tasksCount} icon={CheckSquare} />
        <CardStat title="Revenue" valueRef={revenueRef} icon={DollarSign} />
      </div>
      <RevenueChart />
    </PageWrapper>
  );
}

function CardStat({ title, valueRef, icon: Icon }: { title: string; valueRef: React.RefObject<HTMLParagraphElement | null>; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p ref={valueRef} className="text-3xl font-bold mt-2">0</p>
      <Icon className="h-4 w-4 text-pink-400 mt-2" />
    </div>
  );
}