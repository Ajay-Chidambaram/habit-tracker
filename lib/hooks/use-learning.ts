'use client'

import useSWR from 'swr'
import { LearningItemWithSessions, CreateLearningInput, UpdateLearningInput } from '@/types'
import { api } from '@/lib/api/learning'
import { useToast } from '@/lib/hooks/use-toast'

const LEARNING_KEY = '/api/learning'

function processLearningItems(data: LearningItemWithSessions[]): LearningItemWithSessions[] {
  return data.map(item => ({
    ...item,
    sessions: [],
    progress_percent: Math.min(100, Math.round((item.completed_units / item.total_units) * 100))
  }))
}

export function useLearning() {
  const { toast } = useToast()

  const { data, error, isLoading, mutate } = useSWR<LearningItemWithSessions[]>(
    LEARNING_KEY,
    async () => {
      const rawData = await api.fetchLearningItems()
      return processLearningItems(rawData)
    }
  )

  const items = data || []

  const addItem = async (input: CreateLearningInput) => {
    try {
      await api.createLearningItem(input)
      toast({ title: 'Learning item created' })
      mutate()
      return true
    } catch (err) {
      toast({ title: 'Error creating item', variant: 'destructive' })
      return false
    }
  }

  const updateItem = async (id: string, input: UpdateLearningInput) => {
    try {
      await api.updateLearningItem(id, input)
      toast({ title: 'Item updated' })
      mutate()
      return true
    } catch (err) {
      toast({ title: 'Error updating item', variant: 'destructive' })
      return false
    }
  }

  const deleteItem = async (id: string) => {
    try {
      mutate(items.filter(i => i.id !== id), false)
      await api.deleteLearningItem(id)
      toast({ title: 'Item deleted' })
      return true
    } catch (err) {
      toast({ title: 'Error deleting item', variant: 'destructive' })
      mutate()
      return false
    }
  }

  return {
    items,
    loading: isLoading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refresh: mutate
  }
}
