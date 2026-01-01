
import {
  WishlistItem,
  CreateWishlistInput,
  UpdateWishlistInput
} from '@/types'

const BASE_URL = '/api/wishlist'

export const api = {
  fetchWishlistItems: async (): Promise<WishlistItem[]> => {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error('Failed to fetch wishlist items')
    return res.json()
  },

  createWishlistItem: async (data: CreateWishlistInput): Promise<WishlistItem> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create wishlist item')
    return res.json()
  },

  updateWishlistItem: async (id: string, data: UpdateWishlistInput): Promise<WishlistItem> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update wishlist item')
    return res.json()
  },

  deleteWishlistItem: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete wishlist item')
  }
}
