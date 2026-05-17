"use client";

import { memo, useMemo } from "react";
import {
  Area,
  AreaChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DEFAULT_DATA = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5800 },
  { month: "Mar", revenue: 7200 },
  { month: "Apr", revenue: 6100 },
  { month: "May", revenue: 8900 },
  { month: "Jun", revenue: 10200 },
] as const;

function RevenueChartInner({
  data = DEFAULT_DATA,
}: {
  data?: readonly { month: string; revenue: number }[];
}) {
  const chartData = useMemo(() => [...data], [data]);

  return (
    <Card data-dashboard-card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <AreaChart width={800} height={280} data={chartData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ec4899" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#737373" fontSize={12} />
            <YAxis stroke="#737373" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#ec4899"
              fill="url(#revenueGradient)"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </div>
      </CardContent>
    </Card>
  );
}

const RevenueChart = memo(RevenueChartInner);
export default RevenueChart;
