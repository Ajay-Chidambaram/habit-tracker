'use client'

import useSWR from 'swr'
import { GoalWithMilestones, CreateGoalInput, UpdateGoalInput, GoalMilestone } from '@/types'
import { api } from '@/lib/api/goals'
import { useToast } from '@/lib/hooks/use-toast'

const GOALS_KEY = '/api/goals'

function calculateProgress(milestones: GoalMilestone[]): number {
  if (!milestones || milestones.length === 0) return 0
  const completed = milestones.filter(m => m.is_completed).length
  return Math.round((completed / milestones.length) * 100)
}

function processGoals(data: GoalWithMilestones[]): GoalWithMilestones[] {
  return data.map(goal => ({
    ...goal,
    milestones: goal.milestones || [],
    progress_percent: calculateProgress(goal.milestones || [])
  }))
}

export function useGoals() {
  const { toast } = useToast()

  const { data, error, isLoading, mutate } = useSWR<GoalWithMilestones[]>(
    GOALS_KEY,
    async () => {
      const rawData = await api.fetchGoals()
      return processGoals(rawData)
    }
  )

  const goals = data || []

  const addGoal = async (input: CreateGoalInput) => {
    try {
      await api.createGoal(input)
      toast({ title: 'Goal created successfully' })
      mutate()
      return true
    } catch (err) {
      toast({ title: 'Error creating goal', variant: 'destructive' })
      return false
    }
  }

  const updateGoal = async (id: string, input: UpdateGoalInput) => {
    try {
      await api.updateGoal(id, input)
      toast({ title: 'Goal updated successfully' })
      mutate()
      return true
    } catch (err) {
      toast({ title: 'Error updating goal', variant: 'destructive' })
      return false
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      mutate(goals.filter(g => g.id !== id), false)
      await api.deleteGoal(id)
      toast({ title: 'Goal deleted' })
      return true
    } catch (err) {
      toast({ title: 'Error deleting goal', variant: 'destructive' })
      mutate()
      return false
    }
  }

  return {
    goals,
    loading: isLoading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    refresh: mutate
  }
}
