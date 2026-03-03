'use client'

import useSWR from 'swr'
import { WeeklyReview, SaveWeeklyReviewInput } from '@/types'
import { api } from '@/lib/api/weekly-reviews'
import { useToast } from '@/lib/hooks/use-toast'

export function useWeeklyReview(weekStart: string) {
  const { toast } = useToast()

  const cacheKey = weekStart ? `/api/weekly-reviews?week_start=${weekStart}` : null

  const { data, error, isLoading, mutate } = useSWR<WeeklyReview | null>(
    cacheKey,
    () => api.fetchWeeklyReview(weekStart)
  )

  const saveReview = async (input: SaveWeeklyReviewInput) => {
    try {
      const saved = await api.saveWeeklyReview(input)
      mutate(saved, false)
      toast({ title: 'Review saved!' })
      return true
    } catch (err) {
      toast({ title: 'Error saving review', variant: 'destructive' })
      return false
    }
  }

  return {
    review: data ?? null,
    loading: isLoading,
    error,
    saveReview,
  }
}
