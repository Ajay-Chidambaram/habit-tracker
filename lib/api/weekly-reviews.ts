import { WeeklyReview, SaveWeeklyReviewInput } from '@/types'

const BASE_URL = '/api/weekly-reviews'

export const api = {
  fetchWeeklyReview: async (weekStart: string): Promise<WeeklyReview | null> => {
    const res = await fetch(`${BASE_URL}?week_start=${weekStart}`)
    if (!res.ok) throw new Error('Failed to fetch weekly review')
    return res.json()
  },

  saveWeeklyReview: async (data: SaveWeeklyReviewInput): Promise<WeeklyReview> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to save weekly review')
    return res.json()
  },
}
