
import { cn } from '@/lib/utils/cn'
import { Flame } from 'lucide-react'

interface StreakBadgeProps {
  streak: number
  className?: string
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  const isActive = streak > 0

  return (
    <div className={cn(
      "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold transition-colors",
      isActive
        ? "bg-orange-500/10 text-orange-500"
        : "bg-muted text-muted-foreground",
      className
    )}>
      <Flame className={cn("w-3.5 h-3.5", isActive && "fill-orange-500")} />
      <span>{streak}</span>
    </div>
  )
}
