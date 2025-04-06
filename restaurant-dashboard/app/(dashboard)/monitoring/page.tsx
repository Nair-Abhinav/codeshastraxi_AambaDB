"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock, Download, RefreshCw, XCircle } from "lucide-react"
import LineChartSection from "@/components/charts/line-chart-section"
import AreaChartSection from "@/components/charts/area-chart-section"

export default function MonitoringPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">System Monitoring</h1>
              <p className="text-gray-400 mt-1">Real-time system status and alerts</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-white/10 text-gray-400 hover:text-white">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "System Status", status: "Operational", color: "green" },
              { title: "Active Alerts", count: 2, color: "yellow" },
              { title: "Uptime", value: "99.98%", subtext: "Last 30 days", color: "green" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Card className="bg-zinc-900 border border-white/10">
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-400">{item.title}</p>
                    <div className="flex items-center mt-2">
                      {item.status && (
                        <>
                          <span className="text-xl font-bold">{item.status}</span>
                          <Badge className={`ml-2 bg-${item.color}-500/20 text-${item.color}-400`}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Healthy
                          </Badge>
                        </>
                      )}
                      {item.count !== undefined && (
                        <>
                          <span className="text-xl font-bold">{item.count}</span>
                          <Badge className={`ml-2 bg-${item.color}-500/20 text-${item.color}-400`}>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Warnings
                          </Badge>
                        </>
                      )}
                      {item.value && (
                        <>
                          <span className="text-xl font-bold">{item.value}</span>
                          <span className="text-xs text-gray-400 ml-2">{item.subtext}</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-zinc-900 border border-white/10">
                <CardHeader>
                  <CardTitle>CPU Usage</CardTitle>
                  <CardDescription>Real-time monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <LineChartSection />
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
                  <CardTitle>Memory Usage</CardTitle>
                  <CardDescription>Real-time monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <AreaChartSection />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-zinc-900 border border-white/10">
              <CardHeader>
                <CardTitle>Active Alerts</CardTitle>
                <CardDescription>System warnings and errors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "High CPU Usage",
                      description: "Server CPU usage exceeded 80% for more than 5 minutes",
                      time: "10 minutes ago",
                      severity: "warning",
                    },
                    {
                      title: "Memory Leak Detected",
                      description: "Possible memory leak in application server",
                      time: "25 minutes ago",
                      severity: "warning",
                    },
                    {
                      title: "Database Connection Error",
                      description: "Intermittent connection issues with primary database",
                      time: "1 hour ago",
                      severity: "resolved",
                    },
                    {
                      title: "API Latency Spike",
                      description: "Response time increased by 200% for 10 minutes",
                      time: "2 hours ago",
                      severity: "resolved",
                    },
                  ].map((alert, i) => (
                    <div key={i} className="flex items-start p-4 border border-white/10 rounded-lg">
                      <div className="mr-4 mt-1">
                        {alert.severity === "critical" && (
                          <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                            <XCircle className="h-5 w-5 text-red-400" />
                          </div>
                        )}
                        {alert.severity === "warning" && (
                          <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                          </div>
                        )}
                        {alert.severity === "resolved" && (
                          <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{alert.title}</h3>
                          <Badge
                            className={
                              alert.severity === "critical"
                                ? "bg-red-500/20 text-red-400"
                                : alert.severity === "warning"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-green-500/20 text-green-400"
                            }
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{alert.description}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {alert.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-zinc-900 border border-white/10">
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>Current status of all services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Service</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Uptime</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Last Incident</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "API Server", status: "Operational", uptime: "99.99%", lastIncident: "None" },
                        { name: "Web Server", status: "Operational", uptime: "99.95%", lastIncident: "3 days ago" },
                        { name: "Database", status: "Degraded", uptime: "99.5%", lastIncident: "1 hour ago" },
                        { name: "Authentication", status: "Operational", uptime: "100%", lastIncident: "None" },
                        { name: "Storage", status: "Operational", uptime: "99.99%", lastIncident: "7 days ago" },
                      ].map((service, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4">{service.name}</td>
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                service.status === "Operational"
                                  ? "bg-green-500/20 text-green-400"
                                  : service.status === "Degraded"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-red-500/20 text-red-400"
                              }
                            >
                              {service.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{service.uptime}</td>
                          <td className="py-3 px-4 text-gray-400">{service.lastIncident}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

