"use client";

import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Platform } from "@/types";

interface PlatformChartProps {
  data: { platform: Platform; count: number }[];
}

export function PlatformChart({ data }: PlatformChartProps) {
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Platform Distribution</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="platform"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}