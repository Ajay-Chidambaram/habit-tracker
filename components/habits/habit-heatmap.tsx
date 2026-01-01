
import { HabitCompletion } from '@/types'
import { eachDayOfInterval, subDays, format, isSameDay, startOfMonth, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { cn } from '@/lib/utils/cn'


// We might need to handle Tooltip if it's not in ui/index (I didn't see it in list, but I saw 'toast')
// If tooltip is missing, I'll assume standard tooltip or just use title attribute.
// The list of created UI components included: button, card, input, modal, progress-ring, progress-bar, badge, dropdown, tabs, skeleton, toast.
// Tooltip was NOT in the list. I should check before importing.
// I will start without tooltip component to be safe, just title attribute.

interface HabitHeatmapProps {
  completions: HabitCompletion[]
  days?: number // Number of days to show history for
  className?: string
  color?: string
}

export function HabitHeatmap({ completions, days = 100, className, color = 'bg-primary' }: HabitHeatmapProps) {
  const today = new Date()
  const startDate = startOfWeek(subDays(today, days)) // Start from beginning of that week
  const endDate = endOfWeek(today)

  const allDays = eachDayOfInterval({ start: startDate, end: endDate })

  // Transform to weeks
  const weeks: Date[][] = []
  let currentWeek: Date[] = []

  allDays.forEach(day => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  const getIntensity = (date: Date) => {
    const completed = completions.some(c => isSameDay(new Date(c.completed_date), date))
    // We can support multiple times per day intensity later
    return completed ? 1 : 0
  }

  return (
    <div className={cn("flex flex-col gap-2 overflow-x-auto pb-2", className)}>
      <div className="flex gap-1 min-w-max">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => {
              const intensity = getIntensity(day)
              return (
                <div
                  key={day.toISOString()}
                  title={`${format(day, 'MMM d, yyyy')}: ${intensity ? 'Completed' : 'No activity'}`}
                  className={cn(
                    "w-3 h-3 rounded-[2px] transition-colors",
                    intensity
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-muted/50 hover:bg-muted"
                  )}
                  style={intensity ? { backgroundColor: color } : undefined}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground w-full px-1">
        <span>{format(startDate, 'MMM')}</span>
        <span>{format(today, 'MMM')}</span>
      </div>
    </div>
  )
}
