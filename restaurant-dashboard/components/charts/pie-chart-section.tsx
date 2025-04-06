"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Info } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data
const data = [
  { name: "Mobile", orderIssues: 42 },
  { name: "Desktop", orderIssues: 28 },
  { name: "Tablet", orderIssues: 18 },
  { name: "Other", orderIssues: 12 },
];

// Detailed breakdown for drill-down
const detailedData = {
  Mobile: [
    { name: "Android", orderIssues: 25 },
    { name: "iOS", orderIssues: 14 },
    { name: "Other", orderIssues: 3 },
  ],
  Desktop: [
    { name: "Windows", orderIssues: 15 },
    { name: "macOS", orderIssues: 9 },
    { name: "Linux", orderIssues: 4 },
  ],
  Tablet: [
    { name: "iPad", orderIssues: 10 },
    { name: "Android", orderIssues: 6 },
    { name: "Other", orderIssues: 2 },
  ],
  Other: [
    { name: "Smart TV", orderIssues: 5 },
    { name: "Game Console", orderIssues: 4 },
    { name: "Other", orderIssues: 3 },
  ],
};


const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

export default function PieChartSection() {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handlePieClick = (data: any) => {
    if (!selectedSegment) {
      setSelectedSegment(data.name)
    }
  }

  const handleBackClick = () => {
    setSelectedSegment(null)
  }

  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const handlePieLeave = () => {
    setActiveIndex(null)
  }

  // Calculate total for percentage
  const total = (selectedSegment ? detailedData[selectedSegment as keyof typeof detailedData] : data).reduce(
    (sum, entry) => sum + entry.orderIssues,
    0,
  )

  // Add total to each data point
  const dataWithTotal = (selectedSegment ? detailedData[selectedSegment as keyof typeof detailedData] : data).map(
    (item) => ({ ...item, total }),
  )

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {selectedSegment && (
            <button onClick={handleBackClick} className="p-1 rounded-full hover:bg-secondary transition-colors">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
          <h2 className="text-sm font-medium">
            {selectedSegment ? `${selectedSegment} Breakdown` : "Traffic Sources"}
          </h2>
        </div>
        <button className="p-1 rounded-full hover:bg-secondary transition-colors">
          <Info className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 h-[calc(100%-4rem)]">
        <ChartContainer
          config={{
            orderIssues: {  // Changed from 'value' to 'orderIssues' to match data
              label: "Issues",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-full w-full max-w-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithTotal}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="orderIssues"  // Changed from 'value' to 'orderIssues'
                nameKey="name"
                onClick={handlePieClick}
                onMouseEnter={handlePieEnter}
                onMouseLeave={handlePieLeave}
                animationDuration={1000}
                animationBegin={0}
              >
                {dataWithTotal.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                    stroke="hsl(var(--background))"
                    strokeWidth={1}
                    className="transition-opacity duration-300"
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="grid grid-cols-2 gap-2 w-full">
          {dataWithTotal.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <div className="text-sm flex-1 min-w-0">
                <span className="truncate">{entry.name}</span>
                <span className="ml-1 text-muted-foreground text-xs">{((entry.orderIssues / total) * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {!selectedSegment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-muted-foreground"
          >
            <p>Click on a segment to see detailed breakdown.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}