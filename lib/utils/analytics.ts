
import {
  Habit,
  HabitCompletion,
  Goal,
  GoalMilestone,
  LearningItem,
  LearningSession,
  BucketListItem
} from '@/types'
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  eachDayOfInterval,
  format,
  isSameDay,
  parseISO,
  isWithinInterval,
  differenceInDays
} from 'date-fns'

export interface DailyStats {
  date: string
  completions: number
  totalHabits: number
  rate: number
}

export interface DayOfWeekStat {
  day: string
  count: number
  percentage: number
}

/**
 * Calculates completion rate for each day in a given interval
 */
export const getCompletionRateByDate = (
  habits: Habit[],
  completions: HabitCompletion[],
  startDate: Date,
  endDate: Date
): DailyStats[] => {
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  return days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd')

    // For now, simplify and assume all habits are active
    // In a real app, we'd check habit.created_at and is_archived
    const activeHabits = habits.filter(h => !h.is_archived)
    const dayCompletions = completions.filter(c => c.completed_date === dateStr)

    return {
      date: dateStr,
      completions: dayCompletions.length,
      totalHabits: activeHabits.length,
      rate: activeHabits.length > 0 ? (dayCompletions.length / activeHabits.length) * 100 : 0
    }
  })
}

/**
 * Calculates which days of the week have the highest completion rates
 */
export const getDayOfWeekStats = (completions: HabitCompletion[]): DayOfWeekStat[] => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const counts = new Array(7).fill(0)

  completions.forEach(c => {
    const day = parseISO(c.completed_date).getDay()
    counts[day]++
  })

  const total = completions.length || 1

  return dayNames.map((name, i) => ({
    day: name,
    count: counts[i],
    percentage: (counts[i] / total) * 100
  }))
}

/**
 * Calculates monthly summary stats
 */
export const getMonthlySummary = (
  completions: HabitCompletion[],
  goals: Goal[],
  learningSessions: LearningSession[],
  bucketItems: BucketListItem[]
) => {
  const start = startOfMonth(new Date())
  const end = endOfMonth(new Date())
  const interval = { start, end }

  const monthCompletions = completions.filter(c =>
    isWithinInterval(parseISO(c.completed_date), interval)
  )

  const completedGoals = goals.filter(g =>
    g.status === 'completed' && g.completed_at && isWithinInterval(parseISO(g.completed_at), interval)
  )

  const learningTime = learningSessions
    .filter(s => isWithinInterval(parseISO(s.session_date), interval))
    .reduce((acc, s) => acc + s.duration_minutes, 0)

  const achievedBucketItems = bucketItems.filter(b =>
    b.is_completed && b.completed_at && isWithinInterval(parseISO(b.completed_at), interval)
  )

  return {
    habitCompletions: monthCompletions.length,
    goalsCompleted: completedGoals.length,
    learningMinutes: learningTime,
    bucketItemsAchieved: achievedBucketItems.length
  }
}

/**
 * Gets goal progress over time
 */
export const getGoalTimeline = (goals: Goal[], milestones: GoalMilestone[]) => {
  const completedMilestones = milestones
    .filter(m => m.is_completed && m.completed_at)
    .sort((a, b) => new Date(a.completed_at!).getTime() - new Date(b.completed_at!).getTime())

  return completedMilestones.map(m => ({
    date: format(new Date(m.completed_at!), 'MMM d'),
    title: m.title,
    goalId: m.goal_id
  }))
}

/**
 * Calculates average time to complete goals
 */
export const getAverageCompletionTime = (goals: Goal[]) => {
  const completedGoals = goals.filter(g => g.status === 'completed' && g.started_at && g.completed_at)

  if (completedGoals.length === 0) return 0

  const totalDays = completedGoals.reduce((acc, g) => {
    const start = parseISO(g.started_at!)
    const end = parseISO(g.completed_at!)
    return acc + differenceInDays(end, start)
  }, 0)

  return Math.round(totalDays / completedGoals.length)
}
