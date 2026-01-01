
import { GoalMilestone } from '@/types'
import { Check, Trash } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface MilestoneItemProps {
  milestone: GoalMilestone
  onToggle: (id: string, isCompleted: boolean) => void
  onDelete: (id: string) => void
}

export function MilestoneItem({ milestone, onToggle, onDelete }: MilestoneItemProps) {
  return (
    <div className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-bg-elevated/50 hover:bg-bg-elevated transition-colors">
      <button
        onClick={() => onToggle(milestone.id, !milestone.is_completed)}
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border border-primary transition-all",
          milestone.is_completed ? "bg-primary text-primary-foreground" : "bg-transparent"
        )}
      >
        {milestone.is_completed && <Check className="h-3.5 w-3.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium leading-none transition-all",
          milestone.is_completed && "text-muted-foreground line-through decoration-muted-foreground/50"
        )}>
          {milestone.title}
        </p>
        {milestone.description && (
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {milestone.description}
          </p>
        )}
      </div>

      <button
        onClick={() => onDelete(milestone.id)}
        className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-red-500 transition-all focus:opacity-100"
      >
        <Trash className="h-4 w-4" />
      </button>
    </div>
  )
}
