"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  ChevronRight,
  ChevronDown,
  LogOut,
  Menu,
  X,
  LineChart,
  PieChart,
  Activity,
  Calendar,
  HelpCircle,
  FileText,
  Layers,
  Bell,
  MessageSquare,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

interface NavItemProps {
  icon: React.ElementType
  label: string
  href: string
  subItems?: { label: string; href: string }[]
  active?: boolean
}

const NavItem = ({ icon: Icon, label, href, subItems, active }: NavItemProps) => {
  const [expanded, setExpanded] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    if (subItems && subItems.length > 0) {
      e.preventDefault()
      setExpanded(!expanded)
    }
  }

  return (
    <div>
      <Link
        href={href}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
          active
            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )}
      >
        <Icon className={cn("h-5 w-5", active ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
        <span className="flex-1">{label}</span>
        {subItems &&
          subItems.length > 0 &&
          (expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
      </Link>

      <AnimatePresence>
        {expanded && subItems && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-10 py-1 space-y-1">
              {subItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="block px-3 py-2 text-sm rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()

  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [pathname, setOpen])

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", subItems: [] },
    { icon: LineChart, label: "Performance", href: "/performance", subItems: [] },
    { icon: BarChart3, label: "Smart Analyst", href: "/upload-sales", subItems: [] },
    { icon: Users, label: "Users", href: "/users", subItems: [] },
    { icon: Calendar, label: "Calendar", href: "/calendar", subItems: [] },
    { icon: Settings, label: "Settings", href: "/settings", subItems: [] },
    { icon: HelpCircle, label: "Help", href: "/help", subItems: [] },
  ]

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border md:relative md:translate-x-0 transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        initial={false}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold gradient-text">AdminDash</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item, i) => (
              <NavItem
                key={i}
                icon={item.icon}
                label={item.label}
                href={item.href}
                subItems={item.subItems}
                active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              />
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john@example.com</p>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

