
import { useState, useEffect, useCallback } from 'react'
import { HabitWithCompletions, CreateHabitInput, UpdateHabitInput } from '@/types'
import { api } from '@/lib/api/habits'
import { useToast } from '@/lib/hooks/use-toast'
import { calculateStreak } from '@/lib/utils/streaks'
import { isSameDay } from 'date-fns'

export function useHabits() {
  const [habits, setHabits] = useState<HabitWithCompletions[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.fetchHabits()

      const processed = data.map(habit => {
        // Ensure completions is an array
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

      setHabits(processed)
    } catch (err) {
      console.error(err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  const addHabit = async (input: CreateHabitInput) => {
    try {
      await api.createHabit(input)
      toast({ title: 'Habit created successfully' })
      fetchHabits()
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
      fetchHabits()
      return true
    } catch (err) {
      toast({ title: 'Error updating habit', variant: 'destructive' })
      return false
    }
  }

  const deleteHabit = async (id: string) => {
    try {
      await api.deleteHabit(id)
      toast({ title: 'Habit deleted' })
      setHabits(prev => prev.filter(h => h.id !== id))
      return true
    } catch (err) {
      toast({ title: 'Error deleting habit', variant: 'destructive' })
      return false
    }
  }

  const toggleHabit = async (habitId: string, date: string, isCompleted: boolean) => {
    // Optimistic update
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        // Remove existing completion for date if any, then add new one if isCompleted
        // Note: completion dates are unique per habit
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

        const streak = calculateStreak(newCompletions)
        const isCompletedToday = newCompletions.some(c =>
          isSameDay(new Date(c.completed_date), new Date())
        )
        return {
          ...h,
          completions: newCompletions,
          current_streak: streak,
          is_completed_today: isCompletedToday
        }
      }
      return h
    }))

    try {
      if (isCompleted) {
        await api.completeHabit(habitId, date)
      } else {
        await api.uncompleteHabit(habitId, date)
      }
    } catch (err) {
      // Revert on error
      console.error(err)
      toast({ title: 'Error updating status', variant: 'destructive' })
      fetchHabits()
    }
  }

  return {
    habits,
    loading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    refresh: fetchHabits
  }
}
