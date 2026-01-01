"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Activity,
  Target,
  BookOpen,
  Star,
  Folder,
  ShoppingBag,
  BarChart2,
  Settings,
  LogOut
} from "lucide-react"

import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/AuthProvider"

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Habits', href: '/habits', icon: Activity },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Learning', href: '/learning', icon: BookOpen },
  { name: 'Bucket List', href: '/bucket-list', icon: Star },
  { name: 'Projects', href: '/projects', icon: Folder },
  { name: 'Wishlist', href: '/wishlist', icon: ShoppingBag },
]

const secondaryItems = [
  { name: 'Insights', href: '/insights', icon: BarChart2 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <aside className="hidden lg:flex w-[240px] flex-col border-r border-border bg-bg-surface h-screen sticky top-0">
      {/* Logo */}
      <div className="h-[60px] flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent-green/20 text-accent-green flex items-center justify-center font-bold text-lg">
            L
          </div>
          <span className="font-bold text-lg tracking-tight">Life OS</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-accent-green/10 text-accent-green"
                  : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}

        <div className="my-4 border-t border-border/50 mx-2" />

        {secondaryItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-accent-green/10 text-accent-green"
                  : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-text-muted hover:text-status-error hover:bg-status-error/10 gap-2 px-2"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
