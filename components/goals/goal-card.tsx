
import { GoalWithMilestones } from '@/types'
import { Card } from '@/components/ui/card'
import { GoalProgressRing } from './goal-progress-ring'
import { CalendarDays, Target, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'

interface GoalCardProps {
  goal: GoalWithMilestones
}

export function GoalCard({ goal }: GoalCardProps) {
  const isCompleted = goal.status === 'completed'
  const isOverdue = goal.target_date && new Date(goal.target_date) < new Date() && !isCompleted

  return (
    <Link href={`/goals/${goal.id}`}>
      <Card
        className={cn(
          "group relative flex flex-col p-5 transition-all hover:shadow-lg active:scale-[0.99] h-full border-t-4",
          isCompleted && "opacity-70"
        )}
        style={{ borderTopColor: goal.color }}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label="icon">{goal.icon}</span>
            <div>
              <h3 className={cn("font-bold leading-tight", isCompleted && "line-through text-muted-foreground")}>
                {goal.title}
              </h3>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">{goal.category}</p>
            </div>
          </div>
          <GoalProgressRing progress={goal.progress_percent} size={48} strokeWidth={4} color={goal.color} />
        </div>

        {goal.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
            {goal.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" />
            <span>{goal.milestones.length} milestones</span>
          </div>

          {goal.target_date && (
            <div className={cn("flex items-center gap-1.5", isOverdue && "text-red-500 font-medium")}>
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{format(parseISO(goal.target_date), 'MMM d')}</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
