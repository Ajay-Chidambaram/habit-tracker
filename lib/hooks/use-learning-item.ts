'use client'

import useSWR from 'swr'
import { LearningItemWithSessions } from '@/types'
import { api } from '@/lib/api/learning'

export function useLearningItem(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<LearningItemWithSessions>(
    id ? `/api/learning/${id}` : null,
    async () => {
      if (!id) throw new Error('No ID')
      const item = await api.fetchLearningItem(id)
      const sessions = item.sessions || []
      return {
        ...item,
        sessions,
        progress_percent: Math.min(100, Math.round((item.completed_units / item.total_units) * 100))
      }
    }
  )

  return {
    item: data,
    loading: isLoading,
    error,
    refresh: mutate
  }
}
