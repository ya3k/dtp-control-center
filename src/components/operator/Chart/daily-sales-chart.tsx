"use client"

import { useState } from "react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  type TooltipProps,
} from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DailySale } from "@/schemaValidations/operator-analys-schema"

interface DailySalesChartProps {
  data: DailySale[]
}

export function DailySalesChart({ data }: DailySalesChartProps) {
  const [view, setView] = useState<"bar" | "line">("bar")

  // Định dạng dữ liệu cho biểu đồ
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("vi-VN", { month: "short", day: "numeric" }),
    ticketsSold: item.ticketsSold,
    totalIncome: item.totalIncome,
    // Thêm doanh thu đã định dạng để hiển thị trong tooltip
    formattedIncome: `${(item.totalIncome / 1000).toFixed(1)}K VNĐ`,
  }))

  // Tooltip tùy chỉnh
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Số vé: <span className="font-medium text-foreground">{payload[0].value}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Doanh thu:{" "}
            <span className="font-medium text-foreground">{(Number(payload[1].value) / 1000).toFixed(1)}K VNĐ</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Tabs value={view} onValueChange={(v) => setView(v as "bar" | "line")}>
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="bar">Biểu Đồ Cột</TabsTrigger>
            <TabsTrigger value="line">Biểu Đồ Đường</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[300px]">
        {view === "bar" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="ticketsSold" name="Số Vé Bán Được" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="totalIncome" name="Doanh Thu" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="ticketsSold"
                name="Số Vé Bán Được"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line yAxisId="right" type="monotone" dataKey="totalIncome" name="Doanh Thu" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
