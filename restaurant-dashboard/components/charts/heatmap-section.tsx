"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Info } from "lucide-react"
import { cn } from "@/lib/utils"

// Generate sample data for heatmap
const generateHeatmapData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const data: Record<string, Record<number, number>> = {}

  days.forEach((day) => {
    data[day] = {}
    hours.forEach((hour) => {
      // Generate random value between 0 and 100
      data[day][hour] = Math.floor(Math.random() * 100)
    })
  })

  return data
}

// Generate detailed data for drill-down
const generateDetailedData = (day: string) => {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"]

  const data: Record<string, Record<number, number>> = {}

  weeks.forEach((week) => {
    data[week] = {}
    hours.forEach((hour) => {
      // Generate random value between 0 and 100
      data[week][hour] = Math.floor(Math.random() * 100)
    })
  })

  return data
}

// Get color based on value
const getColor = (value: number) => {
  if (value < 20) return "bg-purple-900/30"
  if (value < 40) return "bg-purple-800/40"
  if (value < 60) return "bg-purple-700/50"
  if (value < 80) return "bg-purple-600/60"
  return "bg-purple-500/70"
}

export default function HeatmapSection() {
  const [heatmapData] = useState(generateHeatmapData())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [detailedData, setDetailedData] = useState<any>(null)
  const [hoveredCell, setHoveredCell] = useState<{ row: string; col: number; value: number } | null>(null)

  const handleDayClick = (day: string) => {
    setSelectedDay(day)
    setDetailedData(generateDetailedData(day))
  }

  const handleBackClick = () => {
    setSelectedDay(null)
    setDetailedData(null)
  }

  const days = Object.keys(heatmapData)
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {selectedDay && (
            <button onClick={handleBackClick} className="p-1 rounded-full hover:bg-secondary transition-colors">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
          <h2 className="text-sm font-medium">{selectedDay ? `${selectedDay} Activity` : "Weekly Activity Heatmap"}</h2>
        </div>
        <button className="p-1 rounded-full hover:bg-secondary transition-colors">
          <Info className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hours header */}
          <div className="flex">
            <div className="w-12"></div>
            <div className="flex-1 flex">
              {[0, 6, 12, 18, 23].map((hour) => (
                <div
                  key={hour}
                  className="flex-1 text-xs text-muted-foreground text-center"
                  style={{
                    marginLeft:
                      hour === 0
                        ? 0
                        : `${(hour - [0, 6, 12, 18, 23][[0, 6, 12, 18, 23].indexOf(hour) - 1]) * (100 / 24)}%`,
                  }}
                >
                  {hour}:00
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap grid */}
          <div className="mt-2">
            {(selectedDay ? Object.keys(detailedData) : days).map((row) => (
              <div key={row} className="flex items-center h-8 mb-1">
                <div className="w-12 text-xs text-muted-foreground">{row}</div>
                <div className="flex-1 flex gap-0.5">
                  {hours.map((hour) => {
                    const value = selectedDay ? detailedData[row][hour] : heatmapData[row][hour]

                    return (
                      <div
                        key={hour}
                        className={cn(
                          "flex-1 h-8 rounded-sm transition-all duration-200",
                          getColor(value),
                          !selectedDay && "cursor-pointer hover:transform hover:scale-105",
                        )}
                        onClick={() => !selectedDay && handleDayClick(row)}
                        onMouseEnter={() => setHoveredCell({ row, col: hour, value })}
                        onMouseLeave={() => setHoveredCell(null)}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-end gap-2">
            <div className="text-xs text-muted-foreground">Low</div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-4 w-6 rounded-sm",
                    i === 1 && "bg-purple-900/30",
                    i === 2 && "bg-purple-800/40",
                    i === 3 && "bg-purple-700/50",
                    i === 4 && "bg-purple-600/60",
                    i === 5 && "bg-purple-500/70",
                  )}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground">High</div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="mt-4 p-2 bg-secondary border border-border rounded-lg text-sm"
          >
            <p>
              <span className="font-medium">{hoveredCell.row}</span> at{" "}
              <span className="font-medium">{hoveredCell.col}:00</span>:{" "}
              <span className="text-purple-400">{hoveredCell.value}% activity</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!selectedDay && !hoveredCell && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-muted-foreground"
          >
            <p>Click on a day to see detailed hourly breakdown.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

