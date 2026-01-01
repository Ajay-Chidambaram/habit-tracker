
import {
  Goal,
  GoalWithMilestones,
  CreateGoalInput,
  UpdateGoalInput,
  CreateMilestoneInput,
  GoalMilestone
} from '@/types'

const BASE_URL = '/api/goals'
const MILESTONE_URL = '/api/milestones'

export const api = {
  fetchGoals: async (): Promise<GoalWithMilestones[]> => {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error('Failed to fetch goals')
    return res.json()
  },

  fetchGoal: async (id: string): Promise<GoalWithMilestones> => {
    const res = await fetch(`${BASE_URL}/${id}`)
    if (!res.ok) throw new Error('Failed to fetch goal')
    return res.json()
  },

  createGoal: async (data: CreateGoalInput): Promise<Goal> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create goal')
    return res.json()
  },

  updateGoal: async (id: string, data: UpdateGoalInput): Promise<Goal> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update goal')
    return res.json()
  },

  deleteGoal: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete goal')
  },

  createMilestone: async (goalId: string, data: CreateMilestoneInput): Promise<GoalMilestone> => {
    const res = await fetch(`${BASE_URL}/${goalId}/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create milestone')
    return res.json()
  },

  updateMilestone: async (id: string, data: Partial<GoalMilestone>): Promise<GoalMilestone> => {
    const res = await fetch(`${MILESTONE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to update milestone')
    return res.json()
  },

  deleteMilestone: async (id: string): Promise<void> => {
    const res = await fetch(`${MILESTONE_URL}/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Failed to delete milestone')
  }
}
