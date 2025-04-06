"use client"

import { useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Info } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data
const monthlyData = [
  { name: "Jan", anomalies: 6 },
  { name: "Feb", anomalies: 4 },
  { name: "Mar", anomalies: 8 },
  { name: "Apr", anomalies: 5 },
  { name: "May", anomalies: 3 },
  { name: "Jun", anomalies: 4 },
  { name: "Jul", anomalies: 6 },
  { name: "Aug", anomalies: 7 },
  { name: "Sep", anomalies: 5 },
  { name: "Oct", anomalies: 3 },
  { name: "Nov", anomalies: 4 },
  { name: "Dec", anomalies: 2 },
];

const detailedData = {
  Jan: [
    { name: "Week 1", anomalies: 2 },
    { name: "Week 2", anomalies: 1 },
    { name: "Week 3", anomalies: 2 },
    { name: "Week 4", anomalies: 1 },
  ],
  Feb: [
    { name: "Week 1", anomalies: 1 },
    { name: "Week 2", anomalies: 0 },
    { name: "Week 3", anomalies: 2 },
    { name: "Week 4", anomalies: 1 },
  ],
  Mar: [
    { name: "Week 1", anomalies: 2 },
    { name: "Week 2", anomalies: 2 },
    { name: "Week 3", anomalies: 1 },
    { name: "Week 4", anomalies: 3 },
  ],
  Apr: [
    { name: "Week 1", anomalies: 1 },
    { name: "Week 2", anomalies: 1 },
    { name: "Week 3", anomalies: 2 },
    { name: "Week 4", anomalies: 1 },
  ],
  May: [
    { name: "Week 1", anomalies: 1 },
    { name: "Week 2", anomalies: 0 },
    { name: "Week 3", anomalies: 1 },
    { name: "Week 4", anomalies: 1 },
  ],
  Jun: [
    { name: "Week 1", anomalies: 1 },
    { name: "Week 2", anomalies: 1 },
    { name: "Week 3", anomalies: 1 },
    { name: "Week 4", anomalies: 1 },
  ],
  Jul: [
    { name: "Week 1", anomalies: 1 },
    { name: "Week 2", anomalies: 2 },
    { name: "Week 3", anomalies: 2 },
    { name: "Week 4", anomalies: 1 },
  ],
  Aug: [
    { name: "Week 1", anomalies: 2 },
    { name: "Week 2", anomalies: 2 },
    { name: "Week 3", anomalies: 1 },
    { name: "Week 4", anomalies: 2 },
  ],
  Sep: [
    { name: "Week 1", anomalies: 1 },
    { name: "Week 2", anomalies: 1 },
    { name: "Week 3", anomalies: 2 },
    { name: "Week 4", anomalies: 1 },
  ],
  Oct: [
    { name: "Week 1", anomalies: 1 },
    { name: "Week 2", anomalies: 0 },
    { name: "Week 3", anomalies: 1 },
    { name: "Week 4", anomalies: 1 },
  ],
  Nov: [
    { name: "Week 1", anomalies: 1 },
    { name: "Week 2", anomalies: 1 },
    { name: "Week 3", anomalies: 1 },
    { name: "Week 4", anomalies: 1 },
  ],
  Dec: [
    { name: "Week 1", anomalies: 1 },
    { name: "Week 2", anomalies: 0 },
    { name: "Week 3", anomalies: 0 },
    { name: "Week 4", anomalies: 1 },
  ],
};


export default function AreaChartSection() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  const handleClick = (data: any) => {
    if (!selectedMonth) {
      setSelectedMonth(data.activeLabel)
    }
  }

  const handleBackClick = () => {
    setSelectedMonth(null)
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
            {selectedMonth ? `${selectedMonth} Conversions` : "Conversion Trends"}
          </h2>
        </div>
        <button className="p-1 rounded-full hover:bg-secondary transition-colors">
          <Info className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <ChartContainer
        config={{
          value: {
            label: "Value",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-[calc(100%-2rem)]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
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
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="anomalies"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fill="url(#colorValue)"
              animationDuration={1500}
            />
          </AreaChart>
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
            <p>Click on the chart to see weekly breakdown for a specific month.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

