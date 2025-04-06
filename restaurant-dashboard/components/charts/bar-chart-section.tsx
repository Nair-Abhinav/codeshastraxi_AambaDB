"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Info } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data
const monthlyData = [
  { name: "Jan", value: 400, anomalies: 3 },
  { name: "Feb", value: 300, anomalies: 2 },
  { name: "Mar", value: 600, anomalies: 5 },
  { name: "Apr", value: 800, anomalies: 6 },
  { name: "May", value: 500, anomalies: 4 },
  { name: "Jun", value: 900, anomalies: 7 },
  { name: "Jul", value: 700, anomalies: 5 },
  { name: "Aug", value: 1000, anomalies: 8 },
  { name: "Sep", value: 800, anomalies: 6 },
  { name: "Oct", value: 1200, anomalies: 9 },
  { name: "Nov", value: 900, anomalies: 7 },
  { name: "Dec", value: 1100, anomalies: 10 },
]

const detailedData = {
  Jan: [
    { name: "Day 1-7", anomalies: 1 },
    { name: "Day 8-14", anomalies: 0 },
    { name: "Day 15-21", anomalies: 1 },
    { name: "Day 22-31", anomalies: 1 },
  ],
  Feb: [
    { name: "Day 1-7", anomalies: 0 },
    { name: "Day 8-14", anomalies: 1 },
    { name: "Day 15-21", anomalies: 0 },
    { name: "Day 22-28", anomalies: 1 },
  ],
  Mar: [
    { name: "Day 1-7", anomalies: 2 },
    { name: "Day 8-14", anomalies: 1 },
    { name: "Day 15-21", anomalies: 1 },
    { name: "Day 22-31", anomalies: 1 },
  ],
  Apr: [
    { name: "Day 1-7", anomalies: 1 },
    { name: "Day 8-14", anomalies: 2 },
    { name: "Day 15-21", anomalies: 1 },
    { name: "Day 22-30", anomalies: 2 },
  ],
  May: [
    { name: "Day 1-7", anomalies: 1 },
    { name: "Day 8-14", anomalies: 1 },
    { name: "Day 15-21", anomalies: 1 },
    { name: "Day 22-31", anomalies: 1 },
  ],
  Jun: [
    { name: "Day 1-7", anomalies: 2 },
    { name: "Day 8-14", anomalies: 2 },
    { name: "Day 15-21", anomalies: 1 },
    { name: "Day 22-30", anomalies: 2 },
  ],
  Jul: [
    { name: "Day 1-7", anomalies: 1 },
    { name: "Day 8-14", anomalies: 2 },
    { name: "Day 15-21", anomalies: 1 },
    { name: "Day 22-31", anomalies: 1 },
  ],
  Aug: [
    { name: "Day 1-7", anomalies: 2 },
    { name: "Day 8-14", anomalies: 2 },
    { name: "Day 15-21", anomalies: 2 },
    { name: "Day 22-31", anomalies: 2 },
  ],
  Sep: [
    { name: "Day 1-7", anomalies: 1 },
    { name: "Day 8-14", anomalies: 2 },
    { name: "Day 15-21", anomalies: 1 },
    { name: "Day 22-30", anomalies: 2 },
  ],
  Oct: [
    { name: "Day 1-7", anomalies: 3 },
    { name: "Day 8-14", anomalies: 2 },
    { name: "Day 15-21", anomalies: 2 },
    { name: "Day 22-31", anomalies: 2 },
  ],
  Nov: [
    { name: "Day 1-7", anomalies: 2 },
    { name: "Day 8-14", anomalies: 1 },
    { name: "Day 15-21", anomalies: 2 },
    { name: "Day 22-30", anomalies: 2 },
  ],
  Dec: [
    { name: "Day 1-7", anomalies: 3 },
    { name: "Day 8-14", anomalies: 2 },
    { name: "Day 15-21", anomalies: 2 },
    { name: "Day 22-31", anomalies: 3 },
  ],
}


export default function BarChartSection() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  const handleBarClick = (data: any) => {
    setSelectedMonth(data.name)
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
            {selectedMonth ? `${selectedMonth} Breakdown` : "Monthly Anomalies"}
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
          <BarChart
            data={selectedMonth ? detailedData[selectedMonth as keyof typeof detailedData] : monthlyData}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
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
            <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
            <Bar
              dataKey="anomalies"
              radius={[4, 4, 0, 0]}
              onClick={!selectedMonth ? handleBarClick : undefined}
              onMouseEnter={(_, index) => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
              cursor={!selectedMonth ? "pointer" : "default"}
            >
              {(selectedMonth ? detailedData[selectedMonth as keyof typeof detailedData] : monthlyData).map(
                (_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={hoveredBar === index ? "hsl(var(--chart-1))" : "hsl(var(--chart-1) / 0.5)"}
                    className="transition-all duration-300"
                  />
                ),
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <AnimatePresence>
        {selectedMonth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-muted-foreground"
          >
            <p>Click on the bars to see daily breakdown or use the back button to return to monthly view.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

