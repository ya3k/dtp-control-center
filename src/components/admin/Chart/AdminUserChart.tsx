"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample data for user growth (replace with your actual data)
const chartData = [
  { month: "January", users: 186 },
  { month: "February", users: 305 },
  { month: "March", users: 237 },
  { month: "April", users: 73 },
  { month: "May", users: 209 },
  { month: "June", users: 214 },
];

// Chart configuration
const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))", // Uses shadcn/ui's chart color variable
  },
} satisfies ChartConfig;

export default function AdminUserChart() {
  return (
    <Card className="w-full mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          User Growth - Linear
        </CardTitle>
        <CardDescription className="text-gray-600">
          Showing total users for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke="#e5e7eb" /> {/* Tailwind gray-200 */}
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)} // Shortens month names (e.g., "Jan")
              stroke="#6b7280" // Tailwind gray-500
              fontSize={12}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="users"
              type="linear"
              fill="var(--color-users)"
              fillOpacity={0.4}
              stroke="var(--color-users)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none text-gray-800">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2025 {/* Updated to current year */}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}