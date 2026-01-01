
'use client'

import { useGoals } from '@/lib/hooks/use-goals'
import { Card } from '@/components/ui/card'
import { ProgressRing } from '@/components/ui/progress-ring'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronRight, Target } from 'lucide-react'

export function ActiveGoals() {
  const { goals, loading } = useGoals()

  const activeGoals = goals
    .filter(g => g.status === 'active')
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    .slice(0, 3)

  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 gap-4">
          {[1, 2].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  if (activeGoals.length === 0) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2 min-h-[200px]">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          <Target className="h-6 w-6" />
        </div>
        <h3 className="font-medium text-text">No active goals</h3>
        <p className="text-sm text-text-muted">Set a new goal to start tracking progress.</p>
        <Link href="/goals">
          <Button variant="outline" size="sm" className="mt-2">
            View All Goals
          </Button>
        </Link>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-text">Active Goals</h3>
        <Link href="/goals" className="text-xs text-primary hover:underline flex items-center">
          View all <ChevronRight className="h-3 w-3 ml-0.5" />
        </Link>
      </div>

      <div className="space-y-4">
        {activeGoals.map(goal => (
          <Link key={goal.id} href={`/goals/${goal.id}`}>
            <div className="group flex items-center justify-between p-4 rounded-xl border border-border bg-surface hover:border-primary/30 transition-all duration-200">
              <div className="flex items-center gap-4">
                <ProgressRing
                  value={goal.progress_percent}
                  size={48}
                  strokeWidth={4}
                  style={{ color: goal.color }}
                >
                  <span className="text-xl">{goal.icon}</span>
                </ProgressRing>
                <div className="min-w-0">
                  <h4 className="font-medium text-text truncate group-hover:text-primary transition-colors">
                    {goal.title}
                  </h4>
                  <p className="text-xs text-text-muted">
                    {Math.round(goal.progress_percent)}% complete
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-text-muted group-hover:text-primary transition-all group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
