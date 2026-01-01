"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Activity,
  Target,
  BookOpen,
  MoreHorizontal,
  Star,
  Folder,
  ShoppingBag,
  BarChart2,
  Settings
} from "lucide-react"

import { cn } from "@/lib/utils/cn"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown"

const mainNavItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Habits', href: '/habits', icon: Activity },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Learn', href: '/learning', icon: BookOpen },
]

const moreNavItems = [
  { name: 'Bucket List', href: '/bucket-list', icon: Star },
  { name: 'Projects', href: '/projects', icon: Folder },
  { name: 'Wishlist', href: '/wishlist', icon: ShoppingBag },
  { name: 'Insights', href: '/insights', icon: BarChart2 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-surface border-t border-border flex items-center justify-around px-2 z-50">
      {mainNavItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-16 py-2 rounded-md transition-colors",
              isActive
                ? "text-accent-green"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        )
      })}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-16 py-2 rounded-md transition-colors text-text-secondary hover:text-text-primary outline-none"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="w-56 mb-2">
          {moreNavItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} className="flex items-center gap-3 w-full cursor-pointer">
                <item.icon className="h-4 w-4 text-text-muted" />
                <span>{item.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
