"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRight, Calendar, Filter, Search } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Sample anomalies data
const anomaliesData = [
  {
    id: "a1",
    timestamp: "2023-07-15 14:30:22",
    server: "John Doe",
    category: "Overcharging",
    riskScore: 85,
    status: "pending",
  },
  {
    id: "a2",
    timestamp: "2023-07-15 13:22:45",
    server: "Sarah Smith",
    category: "Missing Items",
    riskScore: 65,
    status: "pending",
  },
  {
    id: "a3",
    timestamp: "2023-07-14 19:15:33",
    server: "Mike Johnson",
    category: "Unauthorized Discounts",
    riskScore: 75,
    status: "pending",
  },
  {
    id: "a4",
    timestamp: "2023-07-14 18:42:18",
    server: "Emily Davis",
    category: "Void After Sale",
    riskScore: 90,
    status: "pending",
  },
  {
    id: "a5",
    timestamp: "2023-07-14 16:35:09",
    server: "Robert Wilson",
    category: "Overcharging",
    riskScore: 55,
    status: "pending",
  },
  {
    id: "a6",
    timestamp: "2023-07-13 20:12:54",
    server: "Jennifer Brown",
    category: "Missing Items",
    riskScore: 60,
    status: "pending",
  },
  {
    id: "a7",
    timestamp: "2023-07-13 19:05:27",
    server: "David Miller",
    category: "Void After Sale",
    riskScore: 80,
    status: "pending",
  },
  {
    id: "a8",
    timestamp: "2023-07-13 15:48:36",
    server: "Lisa Anderson",
    category: "Unauthorized Discounts",
    riskScore: 70,
    status: "pending",
  },
]

export default function AnomaliesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [riskRange, setRiskRange] = useState([0, 100])
  const [searchQuery, setSearchQuery] = useState("")

  // Filter anomalies based on search query and risk range
  const filteredAnomalies = anomaliesData.filter(
    (anomaly) =>
      (anomaly.server.toLowerCase().includes(searchQuery.toLowerCase()) ||
        anomaly.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      anomaly.riskScore >= riskRange[0] &&
      anomaly.riskScore <= riskRange[1],
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Anomalies</h1>
        <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(!isFilterOpen)} className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isFilterOpen ? "auto" : 0,
          opacity: isFilterOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <Card className="border-border bg-surface">
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date Range</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                  <Input id="date" type="date" className="pl-10" defaultValue="2023-07-13" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="overcharging">Overcharging</SelectItem>
                    <SelectItem value="missing-items">Missing Items</SelectItem>
                    <SelectItem value="unauthorized-discounts">Unauthorized Discounts</SelectItem>
                    <SelectItem value="void-after-sale">Void After Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="server">Server</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="server">
                    <SelectValue placeholder="Select server" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Servers</SelectItem>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="sarah-smith">Sarah Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="emily-davis">Emily Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Risk Score Range</Label>
                <div className="px-2 pt-6">
                  <Slider
                    defaultValue={[0, 100]}
                    max={100}
                    step={1}
                    value={riskRange}
                    onValueChange={setRiskRange}
                    className="py-4"
                  />
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>{riskRange[0]}</span>
                    <span>{riskRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
        <Input
          placeholder="Search by server name or category..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Anomalies Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle>Detected Anomalies</CardTitle>
            <CardDescription>{filteredAnomalies.length} anomalies found</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Server</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnomalies.map((anomaly) => (
                  <TableRow key={anomaly.id}>
                    <TableCell className="font-medium">{anomaly.id}</TableCell>
                    <TableCell>{anomaly.timestamp}</TableCell>
                    <TableCell>{anomaly.server}</TableCell>
                    <TableCell>{anomaly.category}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-mono",
                          anomaly.riskScore >= 80
                            ? "border-risk-high text-risk-high"
                            : anomaly.riskScore >= 60
                              ? "border-risk-medium text-risk-medium"
                              : "border-risk-low text-risk-low",
                        )}
                      >
                        {anomaly.riskScore}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {anomaly.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0" asChild>
                        <Link href={`/anomaly/${anomaly.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
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

