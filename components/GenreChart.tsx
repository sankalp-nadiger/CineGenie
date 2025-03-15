"use client";

import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface GenreChartProps {
  data: { genre: string; count: number }[];
}

export function GenreChart({ data }: GenreChartProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Genre Distribution</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data}>
            <XAxis dataKey="genre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(var(--chart-1))" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}