
'use client'

import { useLearning } from '@/lib/hooks/use-learning'
import { Card } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { BookOpen, Clock, ChevronRight } from 'lucide-react'

import { LearningItemWithSessions } from '@/types'

export function LearningSummary() {
  const { items, loading } = useLearning()

  const activeItems = (items || [])
    .filter((item: LearningItemWithSessions) => item.status === 'active')
    .sort((a: LearningItemWithSessions, b: LearningItemWithSessions) => (a.order_index || 0) - (b.order_index || 0))
    .slice(0, 2)

  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full" />
      </Card>
    )
  }

  if (activeItems.length === 0) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2 min-h-[200px]">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          <BookOpen className="h-6 w-6" />
        </div>
        <h3 className="font-medium text-text">No active learning</h3>
        <p className="text-sm text-text-muted">Start learning a new skill today!</p>
      </Card>
    )
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-text">Learning</h3>
        <Link href="/learning" className="text-xs text-primary hover:underline flex items-center">
          View all <ChevronRight className="h-3 w-3 ml-0.5" />
        </Link>
      </div>

      <div className="space-y-4">
        {activeItems.map((item: LearningItemWithSessions) => (
          <Link key={item.id} href={`/learning/${item.id}`}>
            <div className="group space-y-3 p-4 rounded-xl border border-border bg-surface hover:border-primary/30 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-text truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(item.total_time_minutes || 0)} invested</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-text">
                    {Math.round(item.progress_percent)}%
                  </span>
                </div>
              </div>
              <ProgressBar
                value={item.progress_percent}
                style={{ color: item.color }}
                className="h-1.5"
              />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
