
import { HabitWithCompletions } from '@/types'
import { Card } from '@/components/ui/card'
import { StreakBadge } from './streak-badge'
import { Button } from '@/components/ui/button'
import { Check, MoreVertical, Edit, Trash, Calendar } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import { format } from 'date-fns'

interface HabitCardProps {
  habit: HabitWithCompletions
  onToggle: (id: string, date: string, isCompleted: boolean) => void
  onEdit: (habit: HabitWithCompletions) => void
  onDelete: (id: string) => void
}

export function HabitCard({ habit, onToggle, onEdit, onDelete }: HabitCardProps) {
  const isCompleted = habit.is_completed_today

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Assume toggling for today
    const date = format(new Date(), 'yyyy-MM-dd')
    onToggle(habit.id, date, !isCompleted)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete(habit.id)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onEdit(habit)
  }

  return (
    <Link href={`/habits/${habit.id}`}>
      <Card className={cn(
        "group relative flex items-center p-4 transition-all hover:shadow-lg active:scale-[0.99] cursor-pointer border-l-4",
        isCompleted ? "bg-bg-elevated/50" : "bg-bg-elevated"
      )}
        style={{ borderLeftColor: habit.color }}
      >
        {/* Check Button */}
        <div className="mr-4">
          <button
            onClick={handleToggle}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
              isCompleted
                ? "border-transparent text-white"
                : "border-border text-transparent hover:border-primary/50"
            )}
            style={{
              backgroundColor: isCompleted ? habit.color : 'transparent',
              borderColor: isCompleted ? habit.color : undefined
            }}
          >
            <Check className="h-4 w-4 stroke-[3]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "font-semibold truncate leading-none transition-all",
              isCompleted && "text-muted-foreground line-through decoration-muted-foreground/50"
            )}>
              {habit.name}
            </h3>
            {habit.current_streak > 0 && (
              <StreakBadge streak={habit.current_streak} />
            )}
          </div>
          {habit.description && (
            <p className="text-xs text-muted-foreground truncate">{habit.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="ml-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/habits/${habit.id}`}>
                  <Calendar className="mr-2 h-4 w-4" /> History
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:text-red-500">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </Link>
  )
}
