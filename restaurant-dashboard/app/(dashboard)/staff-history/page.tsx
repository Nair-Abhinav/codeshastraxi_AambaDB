"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, ArrowRight, Search, User } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample staff data
const staffData = [
  {
    id: "s1",
    name: "John Doe",
    image: "/placeholder.svg?height=80&width=80",
    role: "Server",
    joinDate: "2021-05-15",
    stats: {
      totalOrders: 1245,
      anomalies: 12,
      acceptanceRate: 92,
    },
    timeline: [
      {
        date: "2023-07-15",
        event: "Anomaly detected: Overcharging",
        status: "pending",
      },
      {
        date: "2023-07-10",
        event: "Anomaly detected: Overcharging",
        status: "resolved",
      },
      {
        date: "2023-07-05",
        event: "Anomaly detected: Void After Sale",
        status: "resolved",
      },
      {
        date: "2023-06-28",
        event: "Anomaly detected: Missing Items",
        status: "dismissed",
      },
    ],
  },
  {
    id: "s2",
    name: "Sarah Smith",
    image: "/placeholder.svg?height=80&width=80",
    role: "Server",
    joinDate: "2022-01-10",
    stats: {
      totalOrders: 856,
      anomalies: 5,
      acceptanceRate: 96,
    },
    timeline: [
      {
        date: "2023-07-15",
        event: "Anomaly detected: Missing Items",
        status: "pending",
      },
      {
        date: "2023-06-22",
        event: "Anomaly detected: Unauthorized Discounts",
        status: "resolved",
      },
      {
        date: "2023-06-10",
        event: "Anomaly detected: Missing Items",
        status: "dismissed",
      },
    ],
  },
  {
    id: "s3",
    name: "Mike Johnson",
    image: "/placeholder.svg?height=80&width=80",
    role: "Server",
    joinDate: "2020-11-05",
    stats: {
      totalOrders: 1876,
      anomalies: 15,
      acceptanceRate: 88,
    },
    timeline: [
      {
        date: "2023-07-14",
        event: "Anomaly detected: Unauthorized Discounts",
        status: "pending",
      },
      {
        date: "2023-07-08",
        event: "Anomaly detected: Void After Sale",
        status: "resolved",
      },
      {
        date: "2023-06-30",
        event: "Anomaly detected: Overcharging",
        status: "resolved",
      },
      {
        date: "2023-06-15",
        event: "Anomaly detected: Missing Items",
        status: "dismissed",
      },
    ],
  },
  {
    id: "s4",
    name: "Emily Davis",
    image: "/placeholder.svg?height=80&width=80",
    role: "Server",
    joinDate: "2022-03-20",
    stats: {
      totalOrders: 723,
      anomalies: 3,
      acceptanceRate: 98,
    },
    timeline: [
      {
        date: "2023-07-14",
        event: "Anomaly detected: Void After Sale",
        status: "pending",
      },
      {
        date: "2023-06-25",
        event: "Anomaly detected: Missing Items",
        status: "resolved",
      },
      {
        date: "2023-06-05",
        event: "Anomaly detected: Unauthorized Discounts",
        status: "dismissed",
      },
    ],
  },
]

export default function StaffHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedStaff, setExpandedStaff] = useState<string | null>(null)

  // Filter staff based on search query
  const filteredStaff = staffData.filter((staff) => staff.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const toggleExpand = (staffId: string) => {
    setExpandedStaff(expandedStaff === staffId ? null : staffId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff History</h1>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
        <Input
          placeholder="Search staff by name..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Staff Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredStaff.map((staff) => (
          <motion.div
            key={staff.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            layout
          >
            <Card className="border-border bg-surface">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={staff.image} alt={staff.name} />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{staff.name}</CardTitle>
                      <CardDescription>
                        {staff.role} • Joined {new Date(staff.joinDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0"
                    onClick={() => toggleExpand(staff.id)}
                  >
                    <ArrowRight
                      className={cn("h-4 w-4 transition-transform", expandedStaff === staff.id && "rotate-90")}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center rounded-md border border-border p-3">
                    <span className="text-lg font-bold">{staff.stats.totalOrders}</span>
                    <span className="text-xs text-text-secondary">Total Orders</span>
                  </div>
                  <div className="flex flex-col items-center rounded-md border border-border p-3">
                    <span className="text-lg font-bold">{staff.stats.anomalies}</span>
                    <span className="text-xs text-text-secondary">Anomalies</span>
                  </div>
                  <div className="flex flex-col items-center rounded-md border border-border p-3">
                    <span className="text-lg font-bold">{staff.stats.acceptanceRate}%</span>
                    <span className="text-xs text-text-secondary">Acceptance</span>
                  </div>
                </div>

                {/* Timeline */}
                {expandedStaff === staff.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-2 overflow-hidden"
                  >
                    <h3 className="text-sm font-medium">Timeline</h3>
                    <div className="space-y-2">
                      {staff.timeline.map((event, index) => (
                        <div key={index} className="relative flex gap-4 pb-4 pl-6 pt-1">
                          <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-surface">
                            <AlertTriangle
                              className={cn(
                                "h-3 w-3",
                                event.status === "pending"
                                  ? "text-risk-high"
                                  : event.status === "resolved"
                                    ? "text-risk-low"
                                    : "text-text-secondary",
                              )}
                            />
                          </div>
                          {index !== staff.timeline.length - 1 && (
                            <div className="absolute bottom-0 left-3 top-6 w-px bg-border" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{event.event}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-text-secondary">{event.date}</p>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  event.status === "pending"
                                    ? "border-risk-high text-risk-high"
                                    : event.status === "resolved"
                                      ? "border-risk-low text-risk-low"
                                      : "border-text-secondary text-text-secondary",
                                )}
                              >
                                {event.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

