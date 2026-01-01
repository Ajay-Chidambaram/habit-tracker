
import { LearningItemWithSessions } from '@/types'
import { LearningCard } from './learning-card'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen } from 'lucide-react'

interface LearningListProps {
  items: LearningItemWithSessions[]
  loading?: boolean
}

export function LearningList({ items, loading }: LearningListProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl border-muted">
        <div className="bg-bg-elevated p-4 rounded-full mb-3">
          <BookOpen className="h-8 w-8 opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-foreground">No learning items</h3>
        <p className="text-sm max-w-xs mx-auto mt-1 mb-4">
          Start tracking books, courses, or skills you want to master.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(item => (
        <LearningCard key={item.id} item={item} />
      ))}
    </div>
  )
}
