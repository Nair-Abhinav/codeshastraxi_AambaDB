"use client"

import type React from "react"

import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  delay: number
}

const StatCard = ({ title, value, change, icon, delay }: StatCardProps) => {
  const isPositive = change > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="bg-zinc-900 border border-white/10 rounded-xl p-6 hover:border-violet-500/50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-violet-600/20 to-indigo-600/20 flex items-center justify-center">
          {icon}
        </div>
        <div className={cn("flex items-center gap-1 text-sm", isPositive ? "text-green-400" : "text-red-400")}>
          <span>{Math.abs(change)}%</span>
          {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
    </motion.div>
  )
}

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Welcome back, here's what's happening with your data today.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-violet-700 hover:to-indigo-700 transition-colors">
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="24,532"
          change={12.5}
          icon={<Users className="h-6 w-6 text-violet-500" />}
          delay={1}
        />
        <StatCard
          title="Revenue"
          value="$45,231"
          change={8.2}
          icon={<DollarSign className="h-6 w-6 text-indigo-500" />}
          delay={2}
        />
        <StatCard
          title="Active Sessions"
          value="1,893"
          change={-3.1}
          icon={<Activity className="h-6 w-6 text-fuchsia-500" />}
          delay={3}
        />
        <StatCard
          title="Conversions"
          value="432"
          change={4.3}
          icon={<ShoppingCart className="h-6 w-6 text-purple-500" />}
          delay={4}
        />
      </div>
    </div>
  )
}

