"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, ShoppingCart , IndianRupeeIcon,Utensils } from "lucide-react"
import BarChartSection from "@/components/charts/bar-chart-section"
import LineChartSection from "@/components/charts/line-chart-section"
import PieChartSection from "@/components/charts/pie-chart-section"
import AreaChartSection from "@/components/charts/area-chart-section"
import HeatmapSection from "@/components/charts/heatmap-section"


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, here's what's happening with your data today.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-secondary text-secondary-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <Button className="gradient-bg gradient-bg-hover">Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Orders"
          value="1239"
          change={12.5}
          icon={<Users className="h-5 w-5 text-purple-500" />}
          delay={1}
        />
        <StatCard
          title="Revenue"
          value="₹27800"
          change={8.2}
          icon={< IndianRupeeIcon className="h-5 w-5 text-blue-500" />}
          delay={2}
        />
        <StatCard
          title="Active Orders"
          value="476"
          change={-3.1}
          icon={<Activity className="h-5 w-5 text-pink-500" />}
          delay={3}
        />
        <StatCard
          title="Orders Delivered"
          value="386"
          change={4.3}
          icon={<Utensils className="h-5 w-5 text-purple-500" />}
          delay={4}
        />
      </div>

      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Anomaly Statistics</CardTitle>
                  <CardDescription>Monthly Anomaly breakdown</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChartSection />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Anomaly</CardTitle>
                  <CardDescription>Daily Anomaly Occurences</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChartSection />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Anomaly Based On Orders</CardTitle>
                  <CardDescription>Where your users come from</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <PieChartSection />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Trends</CardTitle>
                  <CardDescription>Conversion rate over time</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <AreaChartSection />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Activity Heatmap</CardTitle>
                <CardDescription>User activity by day and hour</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <HeatmapSection />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>View and download your reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">Monthly Performance Report</h3>
                      <p className="text-sm text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed analytics data</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ title, value, change, icon, delay }) {
  const isPositive = change > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center">{icon}</div>
            <div className={cn("flex items-center gap-1 text-sm", isPositive ? "text-green-500" : "text-red-500")}>
              <span>{Math.abs(change)}%</span>
              {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-muted-foreground text-sm">{title}</h3>
            <p className="text-2xl font-semibold mt-1">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}