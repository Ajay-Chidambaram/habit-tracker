
'use client'

import { TodayHabits } from "@/components/dashboard/today-habits"
import { ActiveGoals } from "@/components/dashboard/active-goals"
import { LearningSummary } from "@/components/dashboard/learning-summary"
import { StreakSummary } from "@/components/dashboard/streak-summary"
import { WeeklyProgress } from "@/components/dashboard/weekly-progress"
import { useHabits } from "@/lib/hooks/use-habits"
import { format } from "date-fns"
import { HabitWithCompletions } from "@/types"

export default function DashboardPage() {
  const today = new Date()
  const formattedDate = format(today, 'EEEE, MMMM do')

  // Single hook call - data passed down to children
  const { habits, loading: habitsLoading, toggleHabit } = useHabits()

  const pendingHabits = habits.filter((h: HabitWithCompletions) => {
    if (h.is_archived || h.is_completed_today) return false
    if (h.frequency_type === 'daily') return true
    const dayOfWeek = today.getDay()
    if (h.frequency_type === 'specific_days') {
      return (h.frequency_value as number[]).includes(dayOfWeek)
    }
    return true
  }).length

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">Dashboard</h1>
          <p className="text-text-muted mt-1">{formattedDate}</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm font-medium text-primary">Welcome back</p>
          <p className="text-xs text-text-muted">
            {pendingHabits > 0
              ? `You have ${pendingHabits} habit${pendingHabits === 1 ? '' : 's'} to complete today`
              : "You've completed all your habits for today! 🎉"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Row 1 */}
        <div className="lg:col-span-1">
          <StreakSummary habits={habits} loading={habitsLoading} />
        </div>
        <div className="lg:col-span-1">
          <TodayHabits habits={habits} loading={habitsLoading} toggleHabit={toggleHabit} />
        </div>
        <div className="lg:col-span-1">
          <WeeklyProgress habits={habits} loading={habitsLoading} />
        </div>

        {/* Row 2 */}
        <div className="lg:col-span-2">
          <ActiveGoals />
        </div>
        <div className="lg:col-span-1">
          <LearningSummary />
        </div>
      </div>
    </div>
  )
}
