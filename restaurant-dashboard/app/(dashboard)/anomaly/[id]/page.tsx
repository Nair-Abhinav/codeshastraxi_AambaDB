"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, CheckCircle, Clock, ThumbsDown, ThumbsUp, User, XCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"

// Sample anomaly data
const anomalyData = {
  id: "a1",
  timestamp: "2023-07-15 14:30:22",
  server: {
    id: "s1",
    name: "John Doe",
    image: "/placeholder.svg?height=40&width=40",
    history: [
      {
        id: "h1",
        date: "2023-07-10",
        event: "Anomaly detected: Overcharging",
        status: "resolved",
      },
      {
        id: "h2",
        date: "2023-07-05",
        event: "Anomaly detected: Void After Sale",
        status: "resolved",
      },
      {
        id: "h3",
        date: "2023-06-28",
        event: "Anomaly detected: Missing Items",
        status: "dismissed",
      },
    ],
  },
  category: "Overcharging",
  riskScore: 85,
  status: "pending",
  details: {
    billId: "B12345",
    tableNumber: "15",
    customerCount: 4,
    originalAmount: "$120.50",
    modifiedAmount: "$145.75",
    difference: "$25.25",
    items: [
      { name: "Steak", price: "$35.00", quantity: 2 },
      { name: "Wine", price: "$12.50", quantity: 3 },
      { name: "Dessert", price: "$8.50", quantity: 2 },
    ],
    timeline: [
      { time: "14:15:22", event: "Order placed" },
      { time: "14:25:45", event: "Bill generated: $120.50" },
      { time: "14:28:33", event: "Bill modified: $145.75" },
      { time: "14:30:12", event: "Payment processed" },
    ],
  },
  aiAnalysis:
    "This transaction shows a pattern of overcharging. The bill was modified after it was initially generated, with an increase of $25.25. This modification occurred just before payment was processed, which is a common pattern in fraudulent transactions. The server has a history of similar anomalies.",
}

// AI comments
const aiComments = [
  {
    id: "c1",
    timestamp: "2023-07-15 14:35:22",
    content:
      "Initial analysis shows this is a high-risk anomaly. The bill was modified just before payment, which is suspicious.",
  },
  {
    id: "c2",
    timestamp: "2023-07-15 14:40:15",
    content:
      "Looking at the server's history, there's a pattern of similar behavior. This is the third incident in the last month.",
  },
]

export default function AnomalyDetailPage() {
  const params = useParams()
  const anomalyId = params.id

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/anomalies">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Anomaly {anomalyId}</h1>
          <Badge
            variant="outline"
            className={cn(
              "ml-2",
              anomalyData.riskScore >= 80
                ? "border-risk-high text-risk-high"
                : anomalyData.riskScore >= 60
                  ? "border-risk-medium text-risk-medium"
                  : "border-risk-low text-risk-low",
            )}
          >
            Risk Score: {anomalyData.riskScore}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1 border-risk-high text-risk-high hover:bg-risk-high/10">
            <XCircle className="h-4 w-4" />
            Decline
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 border-text-secondary text-text-secondary hover:bg-text-secondary/10"
          >
            <Clock className="h-4 w-4" />
            Forward
          </Button>
          <Button size="sm" className="gap-1 bg-risk-low text-background hover:bg-risk-low/90">
            <CheckCircle className="h-4 w-4" />
            Accept
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Bill Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-2"
        >
          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle>Bill Details</CardTitle>
              <CardDescription>
                {anomalyData.timestamp} • {anomalyData.category}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs text-text-secondary">Bill ID</p>
                  <p className="font-medium">{anomalyData.details.billId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-text-secondary">Table Number</p>
                  <p className="font-medium">{anomalyData.details.tableNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-text-secondary">Customer Count</p>
                  <p className="font-medium">{anomalyData.details.customerCount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-text-secondary">Original Amount</p>
                  <p className="font-medium">{anomalyData.details.originalAmount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-text-secondary">Modified Amount</p>
                  <p className="font-medium text-risk-high">{anomalyData.details.modifiedAmount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-text-secondary">Difference</p>
                  <p className="font-medium text-risk-high">{anomalyData.details.difference}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Items</h3>
                <div className="rounded-md border border-border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-2 text-left text-sm font-medium">Item</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Price</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Quantity</th>
                        <th className="px-4 py-2 text-right text-sm font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anomalyData.details.items.map((item, index) => (
                        <tr
                          key={index}
                          className={index !== anomalyData.details.items.length - 1 ? "border-b border-border" : ""}
                        >
                          <td className="px-4 py-2 text-sm">{item.name}</td>
                          <td className="px-4 py-2 text-sm">{item.price}</td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 text-right text-sm">
                            ${(Number.parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Timeline</h3>
                <div className="space-y-2">
                  {anomalyData.details.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-2 rounded-md border border-border p-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-text-secondary">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-border bg-background p-4">
                <h3 className="mb-2 text-sm font-medium">AI Analysis</h3>
                <p className="text-sm text-text-secondary">{anomalyData.aiAnalysis}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Server Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle>Server Details</CardTitle>
              <CardDescription>History and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={anomalyData.server.image} alt={anomalyData.server.name} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{anomalyData.server.name}</h3>
                  <p className="text-sm text-text-secondary">Server ID: {anomalyData.server.id}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 gap-1">
                      <User className="h-3 w-3" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 text-sm font-medium">Anomaly History</h3>
                <div className="space-y-2">
                  {anomalyData.server.history.map((event) => (
                    <div key={event.id} className="rounded-md border border-border p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{event.event}</p>
                        <Badge
                          variant="outline"
                          className={
                            event.status === "resolved"
                              ? "border-risk-low text-risk-low"
                              : "border-risk-high text-risk-high"
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-secondary">{event.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Comments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-6"
          >
            <Card className="border-border bg-surface">
              <CardHeader>
                <CardTitle>AI Comments</CardTitle>
                <CardDescription>Analysis and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiComments.map((comment) => (
                  <div key={comment.id} className="rounded-md border border-border bg-background p-3">
                    <p className="text-sm">{comment.content}</p>
                    <p className="mt-1 text-xs text-text-secondary">{comment.timestamp}</p>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <div className="flex w-full flex-col gap-2">
                  <Textarea placeholder="Add your comment..." className="min-h-[80px] resize-none" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        Agree
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <ThumbsDown className="h-3 w-3" />
                        Disagree
                      </Button>
                    </div>
                    <Button size="sm" className="bg-accent hover:bg-accent/90">
                      Submit
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

