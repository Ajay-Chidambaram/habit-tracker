
import { useState, useEffect, useCallback } from 'react'
import { LearningItemWithSessions, CreateLearningInput, UpdateLearningInput, CreateSessionInput } from '@/types'
import { api } from '@/lib/api/learning'
import { useToast } from '@/lib/hooks/use-toast'

export function useLearning() {
  const [items, setItems] = useState<LearningItemWithSessions[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.fetchLearningItems()
      // Note: fetchLearningItems returns LearningItem[], but we might want sessions or progress calc.
      // API currently returns LearningItem[] without sessions list on the list endpoint (to save bandwidth).
      // But we map it to LearningItemWithSessions type (sessions empty) locally.

      const processed = data.map(item => ({
        ...item,
        sessions: [],
        progress_percent: Math.min(100, Math.round((item.completed_units / item.total_units) * 100))
      }))

      setItems(processed)
    } catch (err) {
      console.error(err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const addItem = async (input: CreateLearningInput) => {
    try {
      await api.createLearningItem(input)
      toast({ title: 'Learning item created' })
      fetchItems()
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
      fetchItems()
      return true
    } catch (err) {
      toast({ title: 'Error updating item', variant: 'destructive' })
      return false
    }
  }

  const deleteItem = async (id: string) => {
    try {
      await api.deleteLearningItem(id)
      toast({ title: 'Item deleted' })
      setItems(prev => prev.filter(i => i.id !== id))
      return true
    } catch (err) {
      toast({ title: 'Error deleting item', variant: 'destructive' })
      return false
    }
  }

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refresh: fetchItems
  }
}
