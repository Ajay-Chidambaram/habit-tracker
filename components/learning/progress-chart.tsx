
import { LearningSession } from '@/types'
import { subDays, format, isSameDay, startOfDay } from 'date-fns'
import { cn } from '@/lib/utils/cn'

interface ProgressChartProps {
  sessions: LearningSession[]
  color?: string
}

export function ProgressChart({ sessions, color = '#3b82f6' }: ProgressChartProps) {
  const days = 14
  const data = Array.from({ length: days }).map((_, i) => {
    const date = subDays(new Date(), days - 1 - i)
    const daySessions = sessions.filter(s => isSameDay(parseISOUnsafe(s.session_date), date))
    const totalMinutes = daySessions.reduce((acc, s) => acc + s.duration_minutes, 0)
    return {
      date,
      minutes: totalMinutes,
      label: format(date, 'EEE')
    }
  })

  // Normalize height
  const maxMinutes = Math.max(...data.map(d => d.minutes), 60) // At least 60 min scale

  return (
    <div className="flex items-end justify-between h-32 gap-1 pt-4">
      {data.map((d, i) => {
        const heightPercent = Math.max((d.minutes / maxMinutes) * 100, 4) // Min 4% height
        return (
          <div key={i} className="flex flex-col items-center justify-end w-full gap-2 group relative">
            <div
              className={cn(
                "w-full rounded-t-sm transition-all duration-500",
                d.minutes > 0 ? "opacity-100" : "opacity-20"
              )}
              style={{
                height: `${heightPercent}%`,
                backgroundColor: color
              }}
            >
              {d.minutes > 0 && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  {d.minutes}m
                </div>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground uppercase">{d.label.charAt(0)}</span>
          </div>
        )
      })}
    </div>
  )
}

function parseISOUnsafe(dateString: string) {
  return new Date(dateString)
}
