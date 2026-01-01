
import { HabitWithCompletions } from '@/types'
import { HabitCard } from './habit-card'
import { Skeleton } from '@/components/ui/skeleton'
import { ClipboardList } from 'lucide-react'

interface HabitListProps {
  habits: HabitWithCompletions[]
  loading?: boolean
  onToggle: (id: string, date: string, isCompleted: boolean) => void
  onEdit: (habit: HabitWithCompletions) => void
  onDelete: (id: string) => void
}

export function HabitList({ habits, loading, onToggle, onEdit, onDelete }: HabitListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <div className="bg-bg-elevated p-4 rounded-full mb-3">
          <ClipboardList className="h-8 w-8 opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-foreground">No habits yet</h3>
        <p className="text-sm max-w-xs mx-auto mt-1">
          Create your first habit to start tracking your daily progress.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      {habits.map(habit => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
