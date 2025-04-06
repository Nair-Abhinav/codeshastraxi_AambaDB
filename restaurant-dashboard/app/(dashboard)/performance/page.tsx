// "use client"

// import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { Calendar, Clock, Download, TrendingDown, TrendingUp } from "lucide-react"
// import LineChartSection from "@/components/charts/line-chart-section"
// import AreaChartSection from "@/components/charts/area-chart-section"

// export default function PerformancePage() {
//   return (
//     <div className="flex min-h-screen flex-col bg-black text-white">
//       <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-gradient-to-b from-zinc-950 to-black">
//         <div className="max-w-7xl mx-auto space-y-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-semibold">Anomaly Metrics</h1>
//               <p className="text-gray-400 mt-1">Track and analyze Anomalies</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button variant="outline" size="sm" className="border-white/10 text-gray-400 hover:text-white">
//                 <Calendar className="mr-2 h-4 w-4" />
//                 Last 30 days
//               </Button>
//               <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700">
//                 <Download className="mr-2 h-4 w-4" />
//                 Export
//               </Button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {[
//   { 
//     title: "Menu Item Price Anomaly", 
//     value: "3.2%", 
//     trend: "down", 
//     change: "1.5%",
//     description: "Items priced significantly different from market average"
//   },
//   { 
//     title: "Order Fulfillment Time", 
//     value: "28 min", 
//     trend: "up", 
//     change: "12%",
//     description: "Average time from order to delivery" 
//   },
//   { 
//     title: "Inventory Wastage", 
//     value: "4.7%", 
//     trend: "down", 
//     change: "2.3%",
//     description: "Percentage of inventory discarded"
//   },
//   { 
//     title: "Customer Complaints", 
//     value: "1.9%", 
//     trend: "down", 
//     change: "0.8%",
//     description: "Percentage of orders with reported issues"
//   },
// ].map((metric, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3, delay: i * 0.1 }}
//               >
//                 <Card className="bg-zinc-900 border border-white/10">
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between">
//                       <p className="text-sm text-gray-400">{metric.title}</p>
//                       {metric.trend === "up" ? (
//                         <TrendingUp
//                           className={`h-4 w-4 ${metric.title.includes("Error") ? "text-red-400" : "text-green-400"}`}
//                         />
//                       ) : (
//                         <TrendingDown
//                           className={`h-4 w-4 ${metric.title.includes("Error") ? "text-green-400" : "text-red-400"}`}
//                         />
//                       )}
//                     </div>
//                     <p className="text-2xl font-bold mt-2">{metric.value}</p>
//                     <div className="flex items-center mt-2 text-xs">
//                       <span
//                         className={
//                           metric.trend === "up"
//                             ? metric.title.includes("Error")
//                               ? "text-red-400"
//                               : "text-green-400"
//                             : metric.title.includes("Error")
//                               ? "text-green-400"
//                               : "text-red-400"
//                         }
//                       >
//                         {metric.trend === "up" ? "+" : "-"}
//                         {metric.change}
//                       </span>
//                       <span className="text-gray-400 ml-1">from last period</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>

//           <Tabs defaultValue="system" className="w-full">
//             <TabsList className="bg-zinc-900 border border-white/10 p-1">
//               <TabsTrigger value="system" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
//                 System
//               </TabsTrigger>
//               <TabsTrigger value="network" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
//                 Network
//               </TabsTrigger>
//               <TabsTrigger
//                 value="database"
//                 className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
//               >
//                 Database
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="system" className="mt-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <Card className="bg-zinc-900 border border-white/10">
//                     <CardHeader>
//                       <CardTitle>Restaurant Confidence Score</CardTitle>
//                       <CardDescription>Performance over time</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="h-80">
//                         <LineChartSection />
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.1 }}
//                 >
//                   <Card className="bg-zinc-900 border border-white/10">
//                     <CardHeader>
//                       <CardTitle>Anomaly Statistics</CardTitle>
//                       <CardDescription>No of Anomalies Detected</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="h-80">
//                         <AreaChartSection />
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               </div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//               >
//                 <Card className="bg-zinc-900 border border-white/10">
//                   <CardHeader className="flex flex-row items-center justify-between">
//                     <div>
//                       <CardTitle>System Processes</CardTitle>
//                       <CardDescription>Top resource-consuming processes</CardDescription>
//                     </div>
//                     <Button variant="outline" size="sm" className="border-white/10">
//                       <Clock className="mr-2 h-4 w-4" />
//                       Refresh
//                     </Button>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="overflow-x-auto">
//                       <table className="w-full">
//                         <thead>
//                           <tr className="border-b border-white/10">
//                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Process</th>
//                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">PID</th>
//                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">CPU</th>
//                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Memory</th>
//                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {[
//                             { name: "node", pid: "1234", cpu: "12%", memory: "256MB", status: "Running" },
//                             { name: "nginx", pid: "2345", cpu: "8%", memory: "128MB", status: "Running" },
//                             { name: "postgres", pid: "3456", cpu: "15%", memory: "512MB", status: "Running" },
//                             { name: "redis", pid: "4567", cpu: "5%", memory: "64MB", status: "Running" },
//                           ].map((process, i) => (
//                             <tr key={i} className="border-b border-white/5 hover:bg-white/5">
//                               <td className="py-3 px-4">{process.name}</td>
//                               <td className="py-3 px-4 text-gray-400">{process.pid}</td>
//                               <td className="py-3 px-4">{process.cpu}</td>
//                               <td className="py-3 px-4">{process.memory}</td>
//                               <td className="py-3 px-4">
//                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
//                                   {process.status}
//                                 </span>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             </TabsContent>

//             <TabsContent value="network" className="mt-6">
//               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//                 <Card className="bg-zinc-900 border border-white/10">
//                   <CardHeader>
//                     <CardTitle>Network Traffic</CardTitle>
//                     <CardDescription>Inbound and outbound data</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="h-80">
//                       <LineChartSection />
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             </TabsContent>

//             <TabsContent value="database" className="mt-6">
//               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//                 <Card className="bg-zinc-900 border border-white/10">
//                   <CardHeader>
//                     <CardTitle>Database Performance</CardTitle>
//                     <CardDescription>Query execution time and throughput</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="h-80">
//                       <AreaChartSection />
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </main>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Download, TrendingDown, TrendingUp } from "lucide-react"
import LineChartSection from "@/components/charts/line-chart-section"
import AreaChartSection from "@/components/charts/area-chart-section"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../Firebase" // Make sure you have this file set up

// Define the Anomaly type based on your Firebase schema
type Anomaly = {
  id: string
  anomalyCount: number
  anomalySeverity: string
  anomalyType: string
  contactPhone: string
  description: string
  flagged: boolean
  name: string
  reportedAt: string
  timestamp: any // Firestore timestamp
}

export default function PerformancePage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch anomalies from Firebase
  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        setLoading(true)
        const anomalyCollection = collection(db, "anomaly")
        const anomalySnapshot = await getDocs(anomalyCollection)
        const anomalyList: Anomaly[] = anomalySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Anomaly[]
        
        setAnomalies(anomalyList)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching anomalies: ", err)
        setError("Failed to load anomaly data")
        setLoading(false)
      }
    }

    fetchAnomalies()
  }, [])

  // Create metrics data from anomalies
  const getAnomalyMetrics = () => {
    if (!anomalies.length) return []

    // Get the most recent timestamp from anomalies
    const getLatestTimestamp = (anomalyType: string) => {
      const filteredAnomalies = anomalies.filter(a => a.anomalyType.includes(anomalyType));
      if (!filteredAnomalies.length) return new Date().toISOString();
      
      // Find the most recent timestamp
      return filteredAnomalies.reduce((latest, current) => {
        const currentDate = current.timestamp?.toDate() || new Date(current.reportedAt);
        const latestDate = latest ? new Date(latest) : new Date(0);
        return currentDate > latestDate ? currentDate.toISOString() : latest;
      }, null);
    };

    // Format time as "Today, 2:30 PM" or "Apr 5, 2:30 PM"
    const formatTime = (timestamp: string) => {
      const date = new Date(timestamp);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      
      const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric' };
      const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      
      const timeString = date.toLocaleTimeString(undefined, timeOptions);
      
      if (isToday) {
        return `Today, ${timeString}`;
      } else {
        const dateString = date.toLocaleDateString(undefined, dateOptions);
        return `${dateString}, ${timeString}`;
      }
    };

    return [
      { 
        title: "Menu Item Price Anomaly", 
        value: `${anomalies.filter(a => a.anomalyType.includes("price")).length || 0}`,
        trend: "down", 
        change: "1.5%",
        description: "Items priced significantly different from market average",
        isPositiveWhenDown: true,
        lastUpdated: formatTime(getLatestTimestamp("price"))
      },
      { 
        title: "Order Fulfillment Time", 
        value: "28 min", 
        trend: "up", 
        change: "12%",
        description: "Average time from order to delivery",
        isPositiveWhenDown: true,
        lastUpdated: formatTime(new Date().toISOString()) // Using current time as placeholder
      },
      { 
        title: "Complimentary Tax Issues", 
        value: `${anomalies.filter(a => a.anomalyType.includes("complimentary")).length || 0}`, 
        trend: "down", 
        change: "2.3%",
        description: "Taxes incorrectly applied to complimentary items",
        isPositiveWhenDown: true,
        lastUpdated: formatTime(getLatestTimestamp("complimentary"))
      },
      { 
        title: "Customer Complaints", 
        value: "1.9%", 
        trend: "down", 
        change: "0.8%",
        description: "Percentage of orders with reported issues",
        isPositiveWhenDown: true,
        lastUpdated: formatTime(new Date().toISOString()) // Using current time as placeholder
      },
    ]
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Anomaly Metrics</h1>
              <p className="text-gray-400 mt-1">Track and analyze Anomalies</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-white/10 text-gray-400 hover:text-white">
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 days
              </Button>
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((_, i) => (
                <Card key={i} className="bg-zinc-900 border border-white/10">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-zinc-800 rounded w-24"></div>
                        <div className="h-4 w-4 bg-zinc-800 rounded"></div>
                      </div>
                      <div className="h-8 bg-zinc-800 rounded w-16 mt-2"></div>
                      <div className="flex items-center mt-2">
                        <div className="h-3 bg-zinc-800 rounded w-12"></div>
                        <div className="h-3 bg-zinc-800 rounded w-16 ml-1"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-700 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {getAnomalyMetrics().map((metric, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <Card className="bg-zinc-900 border border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">{metric.title}</p>
                        {metric.trend === "up" ? (
                          <TrendingUp
                            className={`h-4 w-4 ${metric.isPositiveWhenDown ? "text-red-400" : "text-green-400"}`}
                          />
                        ) : (
                          <TrendingDown
                            className={`h-4 w-4 ${metric.isPositiveWhenDown ? "text-green-400" : "text-red-400"}`}
                          />
                        )}
                      </div>
                      <p className="text-2xl font-bold mt-2">{metric.value}</p>
                      <div className="flex items-center mt-2 text-xs">
                        <span
                          className={
                            (metric.trend === "up") !== metric.isPositiveWhenDown 
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {metric.trend === "up" ? "+" : "-"}
                          {metric.change}
                        </span>
                        <span className="text-gray-400 ml-1">from last period</span>
                      </div>
                      {metric.description && (
                        <p className="mt-2 text-xs text-gray-400">{metric.description}</p>
                      )}
                      <div className="mt-3 flex items-center text-xs text-gray-500 border-t border-white/5 pt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>Updated {metric.lastUpdated}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <Tabs defaultValue="system" className="w-full">
            <TabsList className="bg-zinc-900 border border-white/10 p-1">
              <TabsTrigger value="system" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
                System
              </TabsTrigger>
              <TabsTrigger value="network" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
                Network
              </TabsTrigger>
              <TabsTrigger
                value="database"
                className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
              >
                Database
              </TabsTrigger>
            </TabsList>

            <TabsContent value="system" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-zinc-900 border border-white/10">
                    <CardHeader>
                      <CardTitle>Restaurant Confidence Score</CardTitle>
                      <CardDescription>Performance over time</CardDescription>
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
                      <CardTitle>Anomaly Statistics</CardTitle>
                      <CardDescription>No of Anomalies Detected</CardDescription>
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
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Detected Anomalies</CardTitle>
                      <CardDescription>Anomalies from Firebase database</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="border-white/10">
                      <Clock className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="animate-pulse space-y-2">
                        <div className="h-8 bg-zinc-800 rounded w-full"></div>
                        <div className="h-8 bg-zinc-800 rounded w-full"></div>
                        <div className="h-8 bg-zinc-800 rounded w-full"></div>
                        <div className="h-8 bg-zinc-800 rounded w-full"></div>
                      </div>
                    ) : error ? (
                      <div className="bg-red-900/20 border border-red-700 text-red-400 p-4 rounded-lg">
                        {error}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Anomaly Type</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Severity</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Count</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Reported By</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {anomalies.map((anomaly, i) => (
                              <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                <td className="py-3 px-4 truncate max-w-[200px]">{anomaly.anomalyType}</td>
                                <td className="py-3 px-4 text-gray-400">{anomaly.anomalySeverity}</td>
                                <td className="py-3 px-4">{anomaly.anomalyCount}</td>
                                <td className="py-3 px-4">{anomaly.name}</td>
                                <td className="py-3 px-4">
                                  <span 
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      anomaly.flagged
                                        ? "bg-red-500/10 text-red-400" 
                                        : "bg-green-500/10 text-green-400"
                                    }`}
                                  >
                                    {anomaly.flagged ? "Flagged" : "Resolved"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="network" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-zinc-900 border border-white/10">
                  <CardHeader>
                    <CardTitle>Order Volume by Platform</CardTitle>
                    <CardDescription>Zomato, Swiggy, and direct orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <LineChartSection />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="database" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-zinc-900 border border-white/10">
                  <CardHeader>
                    <CardTitle>Anomaly Details</CardTitle>
                    <CardDescription>Full description of selected anomaly</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                        <div className="h-4 bg-zinc-800 rounded w-full"></div>
                        <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                        <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
                      </div>
                    ) : anomalies.length > 0 ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">{anomalies[0].anomalyType}</h3>
                          <p className="text-sm text-gray-400 mt-1">Reported on {new Date(anomalies[0].reportedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-300">Description</h4>
                          <p className="text-sm mt-1">{anomalies[0].description}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-300">Contact Information</h4>
                          <p className="text-sm mt-1">{anomalies[0].contactPhone}</p>
                        </div>
                      </div>
                    ) : (
                      <p>No anomaly data available</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}