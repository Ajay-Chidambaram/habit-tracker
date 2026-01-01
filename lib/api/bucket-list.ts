
import {
  BucketListItem,
  CreateBucketItemInput,
  UpdateBucketItemInput
} from '@/types'

const BASE_URL = '/api/bucket-list'

export const api = {
  fetchBucketItems: async (): Promise<BucketListItem[]> => {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error('Failed to fetch bucket items')
    return res.json()
  },

  fetchBucketItem: async (id: string): Promise<BucketListItem> => {
    const res = await fetch(`${BASE_URL}/${id}`)
    if (!res.ok) throw new Error('Failed to fetch bucket item')
    return res.json()
  },

  createBucketItem: async (data: CreateBucketItemInput): Promise<BucketListItem> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create bucket item')
    return res.json()
  },

  updateBucketItem: async (id: string, data: UpdateBucketItemInput): Promise<BucketListItem> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update bucket item')
    return res.json()
  },

  deleteBucketItem: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete bucket item')
  }
}
