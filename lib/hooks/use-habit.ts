'use client'

import useSWR from 'swr'
import { HabitWithCompletions } from '@/types'
import { api } from '@/lib/api/habits'
import { calculateStreak } from '@/lib/utils/streaks'
import { isSameDay } from 'date-fns'

export function useHabit(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<HabitWithCompletions>(
    id ? `/api/habits/${id}` : null,
    async () => {
      if (!id) throw new Error('No ID')
      const habit = await api.fetchHabit(id)
      const completions = habit.completions || []
      return {
        ...habit,
        completions,
        current_streak: calculateStreak(completions),
        is_completed_today: completions.some(c =>
          isSameDay(new Date(c.completed_date), new Date())
        )
      }
    }
  )

  return {
    habit: data,
    loading: isLoading,
    error,
    refresh: mutate
  }
}
