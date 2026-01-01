
import { HabitCompletion } from '@/types'
import { isSameDay, subDays, startOfDay } from 'date-fns'

export const calculateStreak = (completions: HabitCompletion[]): number => {
  if (!completions || !completions.length) return 0

  // Optimize: map dates to timestamps for easy lookup
  // We use startOfDay to ensure time part doesn't mess up comparison
  const completionTimestamps = new Set(
    completions.map(c => startOfDay(new Date(c.completed_date)).getTime())
  )

  let streak = 0
  const today = startOfDay(new Date())
  let checkDate = today

  /*
    Logic mirrors the database function public.get_habit_streak:
    1. Check if completed on checkDate.
    2. If yes: increment streak, move checkDate to previous day.
    3. If no:
       - If checkDate is TODAY, it's fine (streak not broken yet), just move to yesterday.
       - If checkDate is not TODAY, streak is broken.
  */

  while (true) {
    const checkTime = checkDate.getTime()
    const hasCompletion = completionTimestamps.has(checkTime)

    if (hasCompletion) {
      streak++
      checkDate = subDays(checkDate, 1)
    } else {
      if (isSameDay(checkDate, today)) {
        checkDate = subDays(checkDate, 1)
      } else {
        break
      }
    }

    // Safety limit to prevent infinite loops (though logic shouldn't allow it)
    if (streak > 3650) break;
  }

  return streak
}
