
import {
  Habit,
  HabitWithCompletions,
  CreateHabitInput,
  UpdateHabitInput,
  HabitCompletion
} from '@/types'

const BASE_URL = '/api/habits'

export const api = {
  fetchHabits: async (): Promise<HabitWithCompletions[]> => {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error('Failed to fetch habits')
    return res.json()
  },

  fetchHabit: async (id: string): Promise<HabitWithCompletions> => {
    const res = await fetch(`${BASE_URL}/${id}`)
    if (!res.ok) throw new Error('Failed to fetch habit')
    return res.json()
  },

  createHabit: async (data: CreateHabitInput): Promise<Habit> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create habit')
    return res.json()
  },

  updateHabit: async (id: string, data: UpdateHabitInput): Promise<Habit> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update habit')
    return res.json()
  },

  deleteHabit: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete habit')
  },

  completeHabit: async (id: string, date: string, notes?: string, duration?: number): Promise<HabitCompletion> => {
    const res = await fetch(`${BASE_URL}/${id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, notes, duration_minutes: duration }),
    })
    if (!res.ok) throw new Error('Failed to complete habit')
    return res.json()
  },

  uncompleteHabit: async (id: string, date: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}/complete?date=${date}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to uncomplete habit')
  }
}
