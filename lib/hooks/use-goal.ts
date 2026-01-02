'use client'

import useSWR from 'swr'
import { GoalWithMilestones, GoalMilestone } from '@/types'
import { api } from '@/lib/api/goals'

function calculateProgress(milestones: GoalMilestone[]): number {
  if (!milestones || milestones.length === 0) return 0
  const completed = milestones.filter(m => m.is_completed).length
  return Math.round((completed / milestones.length) * 100)
}

export function useGoal(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<GoalWithMilestones>(
    id ? `/api/goals/${id}` : null,
    async () => {
      if (!id) throw new Error('No ID')
      const goal = await api.fetchGoal(id)
      const milestones = goal.milestones || []
      return {
        ...goal,
        milestones,
        progress_percent: calculateProgress(milestones)
      }
    }
  )

  return {
    goal: data,
    loading: isLoading,
    error,
    refresh: mutate
  }
}
