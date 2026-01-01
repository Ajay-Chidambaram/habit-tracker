
import { HabitWithCompletions } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Flame, CheckCircle2, TrendingUp } from 'lucide-react'
import { subDays, isAfter } from 'date-fns'

interface HabitStatsProps {
  habit: HabitWithCompletions
}

export function HabitStats({ habit }: HabitStatsProps) {
  const { completions, current_streak } = habit

  // Calculate completion rate for last 30 days
  const now = new Date()
  const thirtyDaysAgo = subDays(now, 30)

  const recentCompletions = completions.filter(c =>
    isAfter(new Date(c.completed_date), thirtyDaysAgo)
  )

  const completionRate = Math.round((recentCompletions.length / 30) * 100)

  // Total completions
  const totalCount = completions.length

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center gap-1.5">
          <Flame className="w-5 h-5 text-orange-500 mb-1" />
          <span className="text-2xl font-bold">{current_streak}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Streak</span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center gap-1.5">
          <TrendingUp className="w-5 h-5 text-blue-500 mb-1" />
          <span className="text-2xl font-bold">{completionRate}%</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Message 30 Days</span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center gap-1.5">
          <CheckCircle2 className="w-5 h-5 text-green-500 mb-1" />
          <span className="text-2xl font-bold">{totalCount}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total</span>
        </CardContent>
      </Card>
    </div>
  )
}
