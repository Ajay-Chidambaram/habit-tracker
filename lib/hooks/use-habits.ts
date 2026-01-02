'use client'

import useSWR from 'swr'
import { HabitWithCompletions, CreateHabitInput, UpdateHabitInput } from '@/types'
import { api } from '@/lib/api/habits'
import { useToast } from '@/lib/hooks/use-toast'
import { calculateStreak } from '@/lib/utils/streaks'
import { isSameDay } from 'date-fns'

// Cache key
const HABITS_KEY = '/api/habits'

// Transform function to process raw data
function processHabits(data: HabitWithCompletions[]): HabitWithCompletions[] {
  return data.map(habit => {
    const completions = habit.completions || []
    const streak = calculateStreak(completions)
    const isCompletedToday = completions.some(c =>
      isSameDay(new Date(c.completed_date), new Date())
    )
    return {
      ...habit,
      completions,
      current_streak: streak,
      is_completed_today: isCompletedToday
    }
  })
}

export function useHabits() {
  const { toast } = useToast()

  const { data, error, isLoading, mutate } = useSWR<HabitWithCompletions[]>(
    HABITS_KEY,
    async () => {
      const rawData = await api.fetchHabits()
      return processHabits(rawData)
    }
  )

  const habits = data || []

  const addHabit = async (input: CreateHabitInput) => {
    try {
      await api.createHabit(input)
      toast({ title: 'Habit created successfully' })
      mutate() // Revalidate cache
      return true
    } catch (err) {
      toast({ title: 'Error creating habit', variant: 'destructive' })
      return false
    }
  }

  const updateHabit = async (id: string, input: UpdateHabitInput) => {
    try {
      await api.updateHabit(id, input)
      toast({ title: 'Habit updated successfully' })
      mutate()
      return true
    } catch (err) {
      toast({ title: 'Error updating habit', variant: 'destructive' })
      return false
    }
  }

  const deleteHabit = async (id: string) => {
    try {
      // Optimistic update
      mutate(habits.filter(h => h.id !== id), false)
      await api.deleteHabit(id)
      toast({ title: 'Habit deleted' })
      return true
    } catch (err) {
      toast({ title: 'Error deleting habit', variant: 'destructive' })
      mutate() // Revert on error
      return false
    }
  }

  const toggleHabit = async (habitId: string, date: string, isCompleted: boolean) => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return

    // Optimistic update
    const optimisticHabits = habits.map(h => {
      if (h.id !== habitId) return h

      const otherCompletions = h.completions.filter(c => c.completed_date !== date)
      const newCompletions = isCompleted
        ? [...otherCompletions, {
          id: 'temp-' + Date.now(),
          habit_id: habitId,
          completed_date: date,
          created_at: new Date().toISOString(),
          duration_minutes: null,
          notes: null
        }]
        : otherCompletions

      return {
        ...h,
        completions: newCompletions,
        current_streak: calculateStreak(newCompletions),
        is_completed_today: newCompletions.some(c =>
          isSameDay(new Date(c.completed_date), new Date())
        )
      }
    })

    mutate(optimisticHabits, false) // Update cache immediately, don't revalidate yet

    try {
      if (isCompleted) {
        await api.completeHabit(habitId, date)
      } else {
        await api.uncompleteHabit(habitId, date)
      }
      mutate() // Revalidate to get server state
    } catch (err) {
      toast({ title: 'Error updating status', variant: 'destructive' })
      mutate() // Revert on error
    }
  }

  return {
    habits,
    loading: isLoading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    refresh: mutate
  }
}
