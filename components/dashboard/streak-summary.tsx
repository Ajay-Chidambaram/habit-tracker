
'use client'

import { useHabits } from '@/lib/hooks/use-habits'
import { Card } from '@/components/ui/card'
import { Flame, Calendar, TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils/cn'
import { isSameDay, startOfWeek, addDays, format, isAfter, isBefore, endOfDay } from 'date-fns'

export function StreakSummary() {
  const { habits, loading } = useHabits()

  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-24 w-full" />
      </Card>
    )
  }

  // Calculate overall streak
  // Defined as consecutive days with at least one completion
  const allCompletions = habits.flatMap(h => h.completions || [])
  const uniqueDates = Array.from(new Set(allCompletions.map(c => c.completed_date)))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  let currentStreak = 0
  const today = new Date()
  let checkDate = new Date()

  // If no completions at all
  if (uniqueDates.length > 0) {
    const latestCompletion = new Date(uniqueDates[0])

    // Check if streak is still active (completed today or yesterday)
    const diffDays = Math.floor((today.getTime() - latestCompletion.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays <= 1) {
      // Start counting backwards
      let dateIdx = 0
      while (dateIdx < uniqueDates.length) {
        const completionDate = new Date(uniqueDates[dateIdx])
        if (isSameDay(checkDate, completionDate)) {
          currentStreak++
          checkDate = addDays(checkDate, -1)
          dateIdx++
        } else if (isSameDay(today, checkDate) && !isSameDay(today, completionDate)) {
          // If today is not completed yet, move to yesterday and keep checking
          checkDate = addDays(checkDate, -1)
        } else {
          break
        }
      }
    }
  }

  // Weekly completion bar (Mon-Sun)
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const weeklyCompletion = weekDays.map(day => {
    const isCompleted = habits.some(h =>
      h.completions.some(c => isSameDay(new Date(c.completed_date), day))
    )
    const isFuture = isAfter(day, endOfDay(new Date()))
    return { day, isCompleted, isFuture }
  })

  // Today's percentage
  const todayHabits = habits.filter(h => {
    if (h.is_archived) return false
    if (h.frequency_type === 'daily') return true
    const dayOfWeek = new Date().getDay()
    if (h.frequency_type === 'specific_days') {
      return (h.frequency_value as number[]).includes(dayOfWeek)
    }
    return true
  })

  const completedToday = todayHabits.filter(h => h.is_completed_today)
  const todayPercent = todayHabits.length > 0
    ? Math.round((completedToday.length / todayHabits.length) * 100)
    : 0

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
          <Flame className="h-8 w-8 fill-orange-500" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-text-muted">Current Streak</h4>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-text">{currentStreak}</span>
            <span className="text-sm text-text-muted">days</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-text-muted" />
            <span className="font-medium text-text">Weekly Activity</span>
          </div>
          <span className="text-text-muted">{format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d')}</span>
        </div>

        <div className="flex justify-between items-center bg-surface p-4 rounded-xl border border-border">
          {weeklyCompletion.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-text-muted">
                {format(day.day, 'eee').charAt(0)}
              </span>
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                  day.isCompleted ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" :
                    day.isFuture ? "bg-border/20 border border-dashed border-border" :
                      "bg-surface border border-border"
                )}
              >
                {day.isCompleted && <Flame className="h-4 w-4 fill-current" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-border">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-text">Today&apos;s Progress</span>
          </div>
          <span className="text-sm font-bold text-primary">{todayPercent}%</span>
        </div>
        <div className="h-2 w-full bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${todayPercent}%` }}
          />
        </div>
      </div>
    </Card>
  )
}
