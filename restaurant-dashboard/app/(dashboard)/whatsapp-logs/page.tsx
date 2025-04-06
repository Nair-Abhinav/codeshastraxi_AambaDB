"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MessageSquare, CheckCircle, XCircle, ThumbsUp, ThumbsDown, User } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample WhatsApp logs data
const whatsappLogsData = [
  {
    id: "w1",
    date: "2023-07-15 14:40:22",
    server: {
      name: "John Doe",
      image: "/placeholder.svg?height=40&width=40",
    },
    risk: "high",
    message: "High risk anomaly detected: Overcharging on bill #B12345. Please review and respond.",
    actions: [
      {
        type: "accept",
        timestamp: "2023-07-15 14:45:33",
      },
    ],
    status: "accepted",
  },
  {
    id: "w2",
    date: "2023-07-14 19:25:45",
    server: {
      name: "Mike Johnson",
      image: "/placeholder.svg?height=40&width=40",
    },
    risk: "high",
    message: "High risk anomaly detected: Unauthorized Discounts on bill #B12346. Please review and respond.",
    actions: [
      {
        type: "decline",
        timestamp: "2023-07-14 19:30:12",
      },
    ],
    status: "declined",
  },
  {
    id: "w3",
    date: "2023-07-14 18:55:33",
    server: {
      name: "Emily Davis",
      image: "/placeholder.svg?height=40&width=40",
    },
    risk: "high",
    message: "High risk anomaly detected: Void After Sale on bill #B12347. Please review and respond.",
    actions: [],
    status: "pending",
  },
  {
    id: "w4",
    date: "2023-07-13 20:20:18",
    server: {
      name: "David Miller",
      image: "/placeholder.svg?height=40&width=40",
    },
    risk: "high",
    message: "High risk anomaly detected: Overcharging on bill #B12348. Please review and respond.",
    actions: [
      {
        type: "accept",
        timestamp: "2023-07-13 20:25:45",
      },
    ],
    status: "accepted",
  },
  {
    id: "w5",
    date: "2023-07-12 19:45:09",
    server: {
      name: "Sarah Smith",
      image: "/placeholder.svg?height=40&width=40",
    },
    risk: "high",
    message: "High risk anomaly detected: Missing Items on bill #B12349. Please review and respond.",
    actions: [
      {
        type: "decline",
        timestamp: "2023-07-12 19:50:22",
      },
    ],
    status: "declined",
  },
]

export default function WhatsappLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter WhatsApp logs based on search query and status filter
  const filteredWhatsappLogs = whatsappLogsData.filter(
    (log) =>
      log.server.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === "all" || log.status === statusFilter),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">WhatsApp Logs</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
          <Input
            placeholder="Search by server name..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* WhatsApp Logs */}
      <div className="space-y-4">
        {filteredWhatsappLogs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-border bg-surface">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={log.server.image} alt={log.server.name} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{log.server.name}</h3>
                        <Badge variant="outline" className="border-risk-high text-risk-high">
                          {log.risk} risk
                        </Badge>
                      </div>
                      <p className="text-xs text-text-secondary">{log.date}</p>
                    </div>
                    <div className="mt-2 rounded-lg bg-background p-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="mt-0.5 h-4 w-4 text-accent" />
                        <p className="text-sm">{log.message}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            log.status === "accepted" && "border-risk-low text-risk-low",
                            log.status === "declined" && "border-risk-high text-risk-high",
                            log.status === "pending" && "border-text-secondary text-text-secondary",
                          )}
                        >
                          {log.status === "accepted" && (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3" /> Accepted
                            </>
                          )}
                          {log.status === "declined" && (
                            <>
                              <XCircle className="mr-1 h-3 w-3" /> Declined
                            </>
                          )}
                          {log.status === "pending" && <>Pending Response</>}
                        </Badge>
                        {log.actions.length > 0 && (
                          <p className="text-xs text-text-secondary">{log.actions[0].timestamp}</p>
                        )}
                      </div>
                      {log.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 border-risk-high text-risk-high hover:bg-risk-high/10"
                          >
                            <ThumbsDown className="h-3 w-3" />
                            Decline
                          </Button>
                          <Button size="sm" className="h-8 gap-1 bg-risk-low text-background hover:bg-risk-low/90">
                            <ThumbsUp className="h-3 w-3" />
                            Accept
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

