"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Phone, CheckCircle, XCircle } from "lucide-react"

// Sample call logs data
const callLogsData = [
  {
    id: "c1",
    date: "2023-07-15 14:35:22",
    server: "John Doe",
    risk: "high",
    status: "answered",
    duration: "2:15",
    notes: "Manager confirmed anomaly and will investigate",
  },
  {
    id: "c2",
    date: "2023-07-14 19:20:45",
    server: "Mike Johnson",
    risk: "high",
    status: "missed",
    duration: "0:00",
    notes: "No answer, SMS sent as fallback",
  },
  {
    id: "c3",
    date: "2023-07-14 18:50:33",
    server: "Emily Davis",
    risk: "high",
    status: "answered",
    duration: "1:45",
    notes: "Manager will review with server tomorrow",
  },
  {
    id: "c4",
    date: "2023-07-13 20:15:18",
    server: "David Miller",
    risk: "high",
    status: "answered",
    duration: "3:10",
    notes: "Immediate action taken, anomaly confirmed",
  },
  {
    id: "c5",
    date: "2023-07-12 19:40:09",
    server: "Sarah Smith",
    risk: "high",
    status: "missed",
    duration: "0:00",
    notes: "Called back 10 minutes later",
  },
  {
    id: "c6",
    date: "2023-07-11 21:12:54",
    server: "Jennifer Brown",
    risk: "high",
    status: "answered",
    duration: "1:30",
    notes: "Manager requested more information",
  },
  {
    id: "c7",
    date: "2023-07-10 20:05:27",
    server: "Robert Wilson",
    risk: "high",
    status: "answered",
    duration: "2:45",
    notes: "Issue resolved during call",
  },
]

export default function CallLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter call logs based on search query
  const filteredCallLogs = callLogsData.filter(
    (log) =>
      log.server.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.notes.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Call Logs</h1>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
        <Input
          placeholder="Search by server name, date, or notes..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Call Logs Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle>Voice Call Logs</CardTitle>
            <CardDescription>History of automated calls for high-risk anomalies</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Server</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCallLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>{log.server}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-risk-high text-risk-high">
                        {log.risk}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {log.status === "answered" ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-risk-low" />
                            <span>Answered</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-risk-high" />
                            <span>Missed</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-text-secondary" />
                        <span>{log.duration}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{log.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

