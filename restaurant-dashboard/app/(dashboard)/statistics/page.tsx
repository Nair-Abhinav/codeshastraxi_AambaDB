"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Download, Filter } from "lucide-react"
import PieChartSection from "@/components/charts/pie-chart-section"
import BarChartSection from "@/components/charts/bar-chart-section"
import HeatmapSection from "@/components/charts/heatmap-section"

export default function StatisticsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Statistics</h1>
              <p className="text-gray-400 mt-1">Key metrics and statistical data</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-white/10 text-gray-400 hover:text-white">
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 days
              </Button>
              <Button variant="outline" size="sm" className="border-white/10 text-gray-400 hover:text-white">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Total Users", value: "24,532", subtext: "+12.5% from last month" },
              { title: "Active Users", value: "18,453", subtext: "+8.2% from last month" },
              { title: "Conversion Rate", value: "3.6%", subtext: "+0.8% from last month" },
              { title: "Avg. Session Duration", value: "4m 32s", subtext: "+12s from last month" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Card className="bg-zinc-900 border border-white/10">
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    <p className="text-xs text-green-400 mt-2">{stat.subtext}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-zinc-900 border border-white/10">
                <CardHeader>
                  <CardTitle>User Demographics</CardTitle>
                  <CardDescription>Age and gender distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <PieChartSection />
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
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Users by country</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <BarChartSection />
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
                <CardTitle>Activity Heatmap</CardTitle>
                <CardDescription>User activity by day and hour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <HeatmapSection />
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
                <CardTitle>Device Statistics</CardTitle>
                <CardDescription>User devices and browsers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Devices</h3>
                    <div className="space-y-4">
                      {[
                        { name: "Desktop", value: 45 },
                        { name: "Mobile", value: 35 },
                        { name: "Tablet", value: 15 },
                        { name: "Other", value: 5 },
                      ].map((device, i) => (
                        <div key={i} className="flex items-center">
                          <span className="text-sm w-24">{device.name}</span>
                          <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
                              style={{ width: `${device.value}%` }}
                            />
                          </div>
                          <span className="text-sm ml-4 w-12 text-right">{device.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Browsers</h3>
                    <div className="space-y-4">
                      {[
                        { name: "Chrome", value: 60 },
                        { name: "Safari", value: 20 },
                        { name: "Firefox", value: 10 },
                        { name: "Edge", value: 8 },
                        { name: "Other", value: 2 },
                      ].map((browser, i) => (
                        <div key={i} className="flex items-center">
                          <span className="text-sm w-24">{browser.name}</span>
                          <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
                              style={{ width: `${browser.value}%` }}
                            />
                          </div>
                          <span className="text-sm ml-4 w-12 text-right">{browser.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

