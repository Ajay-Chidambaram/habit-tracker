
'use client'

import { useState, useEffect } from 'react'
import { api as habitApi } from '@/lib/api/habits'
import { api as goalApi } from '@/lib/api/goals'
import { api as learningApi } from '@/lib/api/learning'
import { api as bucketApi } from '@/lib/api/bucket-list'
import {
  Habit,
  HabitCompletion,
  Goal,
  GoalMilestone,
  LearningItem,
  LearningSession,
  BucketListItem
} from '@/types'

export const useAnalytics = () => {
  const [data, setData] = useState<{
    habits: Habit[]
    completions: HabitCompletion[]
    goals: Goal[]
    milestones: GoalMilestone[]
    learningSessions: LearningSession[]
    bucketItems: BucketListItem[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [
          habitsWithCompletions,
          goalsWithMilestones,
          learningWithSessions,
          bucketItems
        ] = await Promise.all([
          habitApi.fetchHabits(),
          goalApi.fetchGoals(),
          learningApi.fetchLearningItems(),
          bucketApi.fetchBucketItems()
        ])

        const habits = habitsWithCompletions.map(({ completions, ...h }) => h)
        const completions = habitsWithCompletions.flatMap(h => h.completions)

        const goals = goalsWithMilestones.map(({ milestones, ...g }) => g)
        const milestones = goalsWithMilestones.flatMap(g => g.milestones)

        const learningSessions = learningWithSessions.flatMap(item =>
          (item as any).sessions || []
        )

        setData({
          habits,
          completions,
          goals: goals as Goal[],
          milestones,
          learningSessions,
          bucketItems
        })
      } catch (err: any) {
        console.error('Error fetching analytics data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
