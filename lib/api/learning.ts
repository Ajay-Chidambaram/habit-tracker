
import {
  LearningItem,
  LearningItemWithSessions,
  CreateLearningInput,
  UpdateLearningInput,
  CreateSessionInput,
  LearningSession
} from '@/types'

const BASE_URL = '/api/learning'

export const api = {
  fetchLearningItems: async (): Promise<LearningItemWithSessions[]> => {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error('Failed to fetch learning items')
    return res.json()
  },

  fetchLearningItem: async (id: string): Promise<LearningItemWithSessions> => {
    const res = await fetch(`${BASE_URL}/${id}`)
    if (!res.ok) throw new Error('Failed to fetch learning item')
    return res.json()
  },

  createLearningItem: async (data: CreateLearningInput): Promise<LearningItem> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create learning item')
    return res.json()
  },

  updateLearningItem: async (id: string, data: UpdateLearningInput): Promise<LearningItem> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update learning item')
    return res.json()
  },

  deleteLearningItem: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete learning item')
  },

  logSession: async (itemId: string, data: CreateSessionInput): Promise<LearningSession> => {
    const res = await fetch(`${BASE_URL}/${itemId}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to log session')
    return res.json()
  }
}
