
'use client'

import { useHabits } from '@/lib/hooks/use-habits'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { format, subDays, isSameDay, startOfDay } from 'date-fns'

export function WeeklyProgress() {
  const { habits, loading } = useHabits()

  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full" />
      </Card>
    )
  }

  // Last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(startOfDay(new Date()), 6 - i))

  const dailyStats = last7Days.map(day => {
    const completions = habits.reduce((acc, habit) => {
      const completedOnDay = habit.completions.some(c =>
        isSameDay(new Date(c.completed_date), day)
      )
      return acc + (completedOnDay ? 1 : 0)
    }, 0)

    return {
      day: format(day, 'EEE'),
      fullDate: format(day, 'MMM d'),
      count: completions,
      // Calculate max completions possible for that day (simplification)
      total: habits.length
    }
  })

  const maxCount = Math.max(...dailyStats.map(s => s.count), 1)

  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-semibold text-text">Weekly Performance</h3>

      <div className="flex items-end justify-between h-40 gap-2 pt-4">
        {dailyStats.map((stat, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full">
            <div className="flex-1 w-full flex items-end justify-center">
              <div
                className="w-full max-w-[32px] bg-primary/20 rounded-t-lg group-hover:bg-primary/40 transition-all relative"
                style={{ height: `${(stat.count / maxCount) * 100}%`, minHeight: stat.count > 0 ? '4px' : '0px' }}
              >
                {stat.count > 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {stat.count} done
                  </div>
                )}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all duration-500"
                  style={{ height: stat.count > 0 ? '100%' : '0%' }}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-text-muted uppercase">{stat.day}</span>
              <span className="text-[8px] text-text-muted/60">{stat.fullDate}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
