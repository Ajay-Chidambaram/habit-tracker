
import { GoalWithMilestones } from '@/types'
import { GoalCard } from './goal-card'
import { Skeleton } from '@/components/ui/skeleton'
import { PlusCircle } from 'lucide-react'

interface GoalListProps {
  goals: GoalWithMilestones[]
  loading?: boolean
}

export function GoalList({ goals, loading }: GoalListProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl border-muted">
        <div className="bg-bg-elevated p-4 rounded-full mb-3">
          <PlusCircle className="h-8 w-8 opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-foreground">No goals set</h3>
        <p className="text-sm max-w-xs mx-auto mt-1 mb-4">
          Set ambitious goals and break them down into actionable milestones.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {goals.map(goal => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  )
}
