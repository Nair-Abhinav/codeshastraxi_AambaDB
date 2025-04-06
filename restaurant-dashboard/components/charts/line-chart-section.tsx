"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Info } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data
const monthlyData = [
  { name: "Apr '24", revenue: 2780, orders: 8, avgOrderValue: 347.5, anomaly: false },
  { name: "Jun '24", revenue: 2390, orders: 3, avgOrderValue: 796.7, anomaly: true },
  { name: "Aug '24", revenue: 6675, orders: 17, avgOrderValue: 392.6, anomaly: false },
  { name: "Oct '24", revenue: 2905, orders: 5, avgOrderValue: 581.0, anomaly: false },
  { name: "Jan '25", revenue: 1875, orders: 1, avgOrderValue: 1875.0, anomaly: true },
  { name: "Feb '25", revenue: 693, orders: 2, avgOrderValue: 346.5, anomaly: false },
  { name: "Mar '25", revenue: 3900, orders: 2, avgOrderValue: 1950.0, anomaly: true }
];

// Detailed data for specific months
const detailedData = {
  "Aug '24": [
    { name: "WONTON (VEG)", revenue: 765, orders: 1, avgOrderValue: 765, paymentMode: "CARD", anomaly: false },
    { name: "Manchow Soup (VEG)", revenue: 1095, orders: 3, avgOrderValue: 365, paymentMode: "CARD", anomaly: false },
    { name: "Bottled Water", revenue: 0, orders: 3, avgOrderValue: 0, paymentMode: "CARD", anomaly: true },
    { name: "Roti", revenue: 1020, orders: 12, avgOrderValue: 85, paymentMode: "Paytm", anomaly: false }
  ],
  "Oct '24": [
    { name: "Basmati Rice", revenue: 375, orders: 1, avgOrderValue: 375, paymentMode: "Cash", anomaly: false },
    { name: "Exotic Stir Fried Vegetable", revenue: 795, orders: 1, avgOrderValue: 795, paymentMode: "Cash", anomaly: false },
    { name: "Roomali Roti", revenue: 150, orders: 1, avgOrderValue: 150, paymentMode: "AMEX", anomaly: false },
    { name: "Exotic Stir Fried Vegetable", revenue: 795, orders: 1, avgOrderValue: 795, paymentMode: "CARD", anomaly: false }
  ],
  "Mar '25": [
    { name: "THUMPS UP", revenue: 185, orders: 1, avgOrderValue: 185, paymentMode: "Paytm", anomaly: false },
    { name: "Shirely Temple", revenue: 365, orders: 1, avgOrderValue: 365, paymentMode: "ZOMATO PAY", anomaly: true }
  ]
};

export default function LineChartSection() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [activeLines, setActiveLines] = useState({
    revenue: true,
    orders: true,
    avgOrderValue: true,
  })

  const handleClick = (data: any) => {
    if (!selectedMonth && data?.activeLabel) {
      setSelectedMonth(data.activeLabel)
    }
  }

  const handleBackClick = () => {
    setSelectedMonth(null)
  }

  const toggleLine = (line: keyof typeof activeLines) => {
    setActiveLines((prev) => ({
      ...prev,
      [line]: !prev[line],
    }))
  }

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {selectedMonth && (
            <button onClick={handleBackClick} className="p-1 rounded-full hover:bg-secondary transition-colors">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
          <h2 className="text-sm font-medium">
            {selectedMonth ? `${selectedMonth} Trends` : "Restaurant Performance Trends"}
          </h2>
        </div>
        <button className="p-1 rounded-full hover:bg-secondary transition-colors">
          <Info className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => toggleLine("revenue")}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            activeLines.revenue
              ? "bg-purple-500/20 text-purple-400 border border-purple-500/50"
              : "bg-secondary text-muted-foreground border border-border"
          }`}
        >
          Revenue
        </button>
        <button
          onClick={() => toggleLine("orders")}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            activeLines.orders
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
              : "bg-secondary text-muted-foreground border border-border"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => toggleLine("avgOrderValue")}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            activeLines.avgOrderValue
              ? "bg-pink-500/20 text-pink-400 border border-pink-500/50"
              : "bg-secondary text-muted-foreground border border-border"
          }`}
        >
          Avg Order Value
        </button>
      </div>

      <ChartContainer
        config={{
          revenue: {
            label: "Revenue",
            color: "hsl(var(--chart-1))",
          },
          orders: {
            label: "Orders",
            color: "hsl(var(--chart-2))",
          },
          avgOrderValue: {
            label: "Avg Order Value",
            color: "hsl(var(--chart-3))",
          },
        }}
        className="h-[calc(100%-5rem)]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={selectedMonth ? detailedData[selectedMonth as keyof typeof detailedData] : monthlyData}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            onClick={!selectedMonth ? handleClick : undefined}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              dx={-10}
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={{ stroke: "hsl(var(--muted))" }} />

            {activeLines.revenue && (
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                activeDot={{ r: 6, strokeWidth: 2, fill: "hsl(var(--background))" }}
                animationDuration={1500}
              />
            )}

            {activeLines.orders && (
              <Line
                type="monotone"
                dataKey="orders"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                activeDot={{ r: 6, strokeWidth: 2, fill: "hsl(var(--background))" }}
                animationDuration={1500}
                animationBegin={300}
              />
            )}

            {activeLines.avgOrderValue && (
              <Line
                type="monotone"
                dataKey="avgOrderValue"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                activeDot={{ r: 6, strokeWidth: 2, fill: "hsl(var(--background))" }}
                animationDuration={1500}
                animationBegin={600}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <AnimatePresence>
        {!selectedMonth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-muted-foreground"
          >
            <p>Click on the chart to see breakdown for a specific month.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}