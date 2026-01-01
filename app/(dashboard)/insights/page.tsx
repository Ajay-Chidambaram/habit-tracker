
'use client'

import { useState, useMemo } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MonthlySummary } from '@/components/insights/monthly-summary'
import { HabitAnalytics } from '@/components/insights/habit-analytics'
import { GoalTimeline } from '@/components/insights/goal-timeline'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import {
  getCompletionRateByDate,
  getDayOfWeekStats,
  getMonthlySummary,
  getGoalTimeline,
  getAverageCompletionTime
} from '@/lib/utils/analytics'
import { subDays, startOfWeek, startOfMonth, startOfYear } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, TrendingUp } from 'lucide-react'

export default function InsightsPage() {
  const { data, loading, error } = useAnalytics()
  const [range, setRange] = useState<'week' | 'month' | 'year' | 'all'>('month')

  const stats = useMemo(() => {
    if (!data) return null

    const now = new Date()
    let startDate: Date

    switch (range) {
      case 'week': startDate = startOfWeek(now); break
      case 'month': startDate = startOfMonth(now); break
      case 'year': startDate = startOfYear(now); break
      case 'all': startDate = subDays(now, 365); break // Limit to 1 year for performance or adjust as needed
      default: startDate = subDays(now, 30)
    }

    const dailyStats = getCompletionRateByDate(data.habits, data.completions, startDate, now)
    const dayOfWeekStats = getDayOfWeekStats(data.completions)
    const monthlySummary = getMonthlySummary(
      data.completions,
      data.goals,
      data.learningSessions,
      data.bucketItems
    )
    const goalTimeline = getGoalTimeline(data.goals, data.milestones)
    const averageTime = getAverageCompletionTime(data.goals)

    return {
      dailyStats,
      dayOfWeekStats,
      monthlySummary,
      goalTimeline,
      averageTime
    }
  }, [data, range])

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Insights" description="Analyze your progress and trends" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <Skeleton className="h-[300px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <PageHeader title="Insights" description="Analyze your progress and trends" />
        <Card className="p-12 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-white">Failed to load analytics</h3>
          <p className="text-slate-400 mt-2">{error || 'Something went wrong'}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader title="Insights" description="Analyze your progress and trends" />

        <div className="bg-slate-900/50 p-1 rounded-xl border border-slate-800 self-start">
          <div className="flex bg-slate-900 rounded-lg p-0.5">
            {(['week', 'month', 'year', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${range === r
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <MonthlySummary stats={stats.monthlySummary} />

      <section>
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Habit Performance</h2>
        </div>
        <HabitAnalytics
          dailyStats={stats.dailyStats}
          dayOfWeekStats={stats.dayOfWeekStats}
        />
      </section>

      <section>
        <div className="flex items-center space-x-2 mb-4">
          <AlertCircle className="h-5 w-5 text-purple-400 rotate-180" />
          <h2 className="text-xl font-bold text-white">Goal Progression</h2>
        </div>
        <GoalTimeline
          timeline={stats.goalTimeline}
          averageTime={stats.averageTime}
        />
      </section>
    </div>
  )
}
