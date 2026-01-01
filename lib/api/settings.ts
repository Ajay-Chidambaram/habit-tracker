
import { UserPreferences, Theme } from '@/types'

const BASE_URL = '/api/settings'

export const api = {
  fetchPreferences: async (): Promise<UserPreferences> => {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error('Failed to fetch user preferences')
    return res.json()
  },

  updatePreferences: async (data: Partial<UserPreferences>): Promise<UserPreferences> => {
    const res = await fetch(BASE_URL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update user preferences')
    return res.json()
  },

  exportData: async (): Promise<void> => {
    const res = await fetch(`${BASE_URL}/export`)
    if (!res.ok) throw new Error('Failed to export data')

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `life-os-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }
}
