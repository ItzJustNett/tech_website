"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, BookOpen, TestTube, User, Brain, Sparkles, ShoppingBag } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

// Remove the Analytics nav item from the navItems array
const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Lessons",
    href: "/lessons",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Tests",
    href: "/tests",
    icon: <TestTube className="h-5 w-5" />,
  },
  {
    title: "AI Features",
    href: "/ai-features",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Store",
    href: "/store",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: <User className="h-5 w-5" />,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 md:relative md:translate-x-0",
        isMobile && "-translate-x-full",
      )}
    >
      <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-700 px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">PureMind</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "flex items-center gap-3 justify-start px-3 h-10",
                pathname === item.href && "bg-gray-100 dark:bg-gray-700",
              )}
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="text-xs text-muted-foreground">PureMind - Web Edition &copy; 2025</div>
      </div>
    </div>
  )
}

