"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

// Helper function to get days in month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

// Helper function to get day of week for first day of month
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

// Sample events data
const events = [
  {
    id: 1,
    title: "Team Meeting",
    date: new Date(2023, 6, 5, 10, 0),
    endDate: new Date(2023, 6, 5, 11, 30),
    type: "meeting",
    attendees: [
      { name: "Alex Johnson", image: "/placeholder.svg?height=32&width=32" },
      { name: "Sarah Williams", image: "/placeholder.svg?height=32&width=32" },
      { name: "Michael Chen", image: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: 2,
    title: "Product Demo",
    date: new Date(2023, 6, 12, 14, 0),
    endDate: new Date(2023, 6, 12, 15, 0),
    type: "presentation",
    attendees: [
      { name: "Emily Rodriguez", image: "/placeholder.svg?height=32&width=32" },
      { name: "David Kim", image: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: 3,
    title: "Client Call",
    date: new Date(2023, 6, 18, 11, 0),
    endDate: new Date(2023, 6, 18, 12, 0),
    type: "call",
    attendees: [
      { name: "Lisa Thompson", image: "/placeholder.svg?height=32&width=32" },
      { name: "Alex Johnson", image: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: 4,
    title: "Sprint Planning",
    date: new Date(2023, 6, 20, 9, 0),
    endDate: new Date(2023, 6, 20, 10, 30),
    type: "meeting",
    attendees: [
      { name: "Michael Chen", image: "/placeholder.svg?height=32&width=32" },
      { name: "Sarah Williams", image: "/placeholder.svg?height=32&width=32" },
      { name: "David Kim", image: "/placeholder.svg?height=32&width=32" },
      { name: "Emily Rodriguez", image: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: 5,
    title: "Design Review",
    date: new Date(2023, 6, 25, 13, 0),
    endDate: new Date(2023, 6, 25, 14, 30),
    type: "review",
    attendees: [
      { name: "Sarah Williams", image: "/placeholder.svg?height=32&width=32" },
      { name: "Lisa Thompson", image: "/placeholder.svg?height=32&width=32" },
    ],
  },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  const prevMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
    setSelectedDate(null)
  }

  const nextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
    setSelectedDate(null)
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day)
    setSelectedDate(newDate)
  }

  const getDayEvents = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === day && eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear
      )
    })
  }

  const selectedDateEvents = selectedDate
    ? events.filter((event) => {
        const eventDate = new Date(event.date)
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        )
      })
    : []

  // Create calendar days array
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Calendar</h1>
              <p className="text-gray-400 mt-1">Manage your schedule and events</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 text-gray-400 hover:text-white"
                onClick={prevMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-medium min-w-[150px] text-center">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 text-gray-400 hover:text-white"
                onClick={nextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button className="ml-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2"
            >
              <Card className="bg-zinc-900 border border-white/10">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>
                    {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                      <div key={i} className="text-center text-sm font-medium text-gray-400 py-2">
                        {day}
                      </div>
                    ))}

                    {calendarDays.map((day, i) => {
                      const dayEvents = day ? getDayEvents(day) : []
                      const isSelected =
                        selectedDate &&
                        day === selectedDate.getDate() &&
                        currentMonth === selectedDate.getMonth() &&
                        currentYear === selectedDate.getFullYear()

                      return (
                        <div
                          key={i}
                          className={`min-h-[100px] p-1 border border-white/5 ${
                            day ? "cursor-pointer hover:bg-white/5" : "bg-zinc-950/50"
                          } ${isSelected ? "bg-violet-500/10 border-violet-500/50" : ""}`}
                          onClick={() => day && handleDateClick(day)}
                        >
                          {day && (
                            <>
                              <div className="text-right p-1">
                                <span className={`text-sm ${isSelected ? "text-violet-400 font-medium" : ""}`}>
                                  {day}
                                </span>
                              </div>
                              <div className="space-y-1 mt-1">
                                {dayEvents.slice(0, 2).map((event, j) => (
                                  <div
                                    key={j}
                                    className={`text-xs px-1 py-0.5 rounded truncate ${
                                      event.type === "meeting"
                                        ? "bg-blue-500/20 text-blue-400"
                                        : event.type === "presentation"
                                          ? "bg-yellow-500/20 text-yellow-400"
                                          : event.type === "call"
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-violet-500/20 text-violet-400"
                                    }`}
                                  >
                                    {event.title}
                                  </div>
                                ))}
                                {dayEvents.length > 2 && (
                                  <div className="text-xs text-gray-400 px-1">+{dayEvents.length - 2} more</div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-zinc-900 border border-white/10">
                <CardHeader>
                  <CardTitle>{selectedDate ? formatDate(selectedDate) : "Events"}</CardTitle>
                  <CardDescription>
                    {selectedDate ? `${selectedDateEvents.length} events scheduled` : "Select a date to view events"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    selectedDateEvents.length > 0 ? (
                      <div className="space-y-4">
                        {selectedDateEvents.map((event, i) => (
                          <div key={i} className="p-3 border border-white/10 rounded-lg hover:bg-white/5">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{event.title}</h3>
                              <Badge
                                className={
                                  event.type === "meeting"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : event.type === "presentation"
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : event.type === "call"
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-violet-500/20 text-violet-400"
                                }
                              >
                                {event.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              {formatTime(event.date)} - {formatTime(event.endDate)}
                            </p>
                            <div className="mt-3">
                              <p className="text-xs text-gray-400 mb-2">Attendees:</p>
                              <div className="flex -space-x-2">
                                {event.attendees.map((attendee, j) => (
                                  <Avatar key={j} className="h-6 w-6 border border-black">
                                    <AvatarImage src={attendee.image} alt={attendee.name} />
                                    <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ))}
                                {event.attendees.length > 3 && (
                                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-zinc-800 text-xs border border-black">
                                    +{event.attendees.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">No events scheduled for this day</div>
                    )
                  ) : (
                    <div className="text-center py-8 text-gray-400">Select a date to view events</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

