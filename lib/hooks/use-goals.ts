
import { useState, useEffect, useCallback } from 'react'
import { GoalWithMilestones, CreateGoalInput, UpdateGoalInput, CreateMilestoneInput, GoalMilestone } from '@/types'
import { api } from '@/lib/api/goals'
import { useToast } from '@/lib/hooks/use-toast'

export function useGoals() {
  const [goals, setGoals] = useState<GoalWithMilestones[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const calculateProgress = (milestones: GoalMilestone[]): number => {
    if (!milestones || milestones.length === 0) return 0
    const completed = milestones.filter(m => m.is_completed).length
    return Math.round((completed / milestones.length) * 100)
  }

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.fetchGoals()

      const processed = data.map(goal => ({
        ...goal,
        milestones: goal.milestones || [],
        progress_percent: calculateProgress(goal.milestones || [])
      }))

      setGoals(processed)
    } catch (err) {
      console.error(err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const addGoal = async (input: CreateGoalInput) => {
    try {
      await api.createGoal(input)
      toast({ title: 'Goal created successfully' })
      fetchGoals()
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
      fetchGoals()
      return true
    } catch (err) {
      toast({ title: 'Error updating goal', variant: 'destructive' })
      return false
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      await api.deleteGoal(id)
      toast({ title: 'Goal deleted' })
      setGoals(prev => prev.filter(g => g.id !== id))
      return true
    } catch (err) {
      toast({ title: 'Error deleting goal', variant: 'destructive' })
      return false
    }
  }

  // Milestone operations
  // We can also have useGoal(id) hook, but for now we put everything here or in page components

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    refresh: fetchGoals
  }
}
