
'use client'

import { useHabits } from '@/lib/hooks/use-habits'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Flame } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton'
import { toISODate } from '@/lib/utils/dates'
import { HabitWithCompletions } from '@/types'

export function TodayHabits() {
  const { habits, loading, toggleHabit } = useHabits()
  const today = toISODate(new Date())

  const isHabitDueToday = (habit: HabitWithCompletions) => {
    if (habit.is_archived) return false

    if (habit.frequency_type === 'daily') return true

    const dayOfWeek = new Date().getDay() // 0 (Sun) to 6 (Sat)
    if (habit.frequency_type === 'specific_days') {
      const days = habit.frequency_value as number[]
      return days.includes(dayOfWeek)
    }

    if (habit.frequency_type === 'times_per_week') {
      // For times_per_week, we show it if it's not completed today
      // or if they still have times left to do this week.
      // Simplification: always show if active.
      return true
    }

    return true
  }

  const todayHabits = habits.filter(isHabitDueToday)
  const completedToday = todayHabits.filter(h => h.is_completed_today)
  const isAllDone = todayHabits.length > 0 && todayHabits.length === completedToday.length

  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  if (todayHabits.length === 0) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2 min-h-[200px]">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="font-medium text-text">No habits for today</h3>
        <p className="text-sm text-text-muted">Enjoy your day or add some new habits!</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-text">Today&apos;s Habits</h3>
        <span className="text-xs text-text-muted">
          {completedToday.length} / {todayHabits.length} completed
        </span>
      </div>

      <div className="space-y-3">
        {todayHabits.map(habit => (
          <div
            key={habit.id}
            className={cn(
              "group flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
              habit.is_completed_today
                ? "bg-primary/5 border-primary/20"
                : "bg-surface border-border hover:border-text-muted/30"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
              >
                {habit.icon}
              </div>
              <div className="min-w-0">
                <h4 className={cn(
                  "font-medium truncate transition-all",
                  habit.is_completed_today && "text-text-muted line-through"
                )}>
                  {habit.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Flame className={cn(
                    "h-3 w-3",
                    habit.current_streak > 0 ? "text-orange-500 fill-orange-500" : "text-text-muted"
                  )} />
                  <span>{habit.current_streak} day streak</span>
                </div>
              </div>
            </div>

            <Button
              size="icon"
              variant={habit.is_completed_today ? "default" : "outline"}
              className={cn(
                "h-10 w-10 rounded-full shrink-0 transition-all transform active:scale-90",
                habit.is_completed_today ? "shadow-lg shadow-primary/20" : "hover:bg-primary/10 hover:border-primary/30"
              )}
              onClick={() => toggleHabit(habit.id, today, !habit.is_completed_today)}
            >
              <Check className={cn(
                "h-5 w-5 transition-all",
                habit.is_completed_today ? "scale-110" : "opacity-50"
              )} />
            </Button>
          </div>
        ))}
      </div>

      {isAllDone && (
        <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-center text-sm font-medium">
            🎉 All habits completed! You&apos;re crushing it.
          </div>
        </div>
      )}
    </Card>
  )
}
