
'use client'
import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { WishlistGrid } from '@/components/wishlist/wishlist-grid'
import { WishlistForm } from '@/components/wishlist/wishlist-form'
import { api } from '@/lib/api/wishlist'
import { WishlistItem, CreateWishlistInput, WishlistStatus } from '@/types'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WishlistItem | undefined>(undefined)
  const { toast } = useToast()

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.fetchWishlistItems()
      setItems(data)
    } catch (err) {
      console.error(err)
      toast({ title: 'Error fetching wishlist', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleCreateOrUpdate = async (data: CreateWishlistInput) => {
    try {
      if (editingItem) {
        await api.updateWishlistItem(editingItem.id, data)
        toast({ title: 'Item updated' })
      } else {
        await api.createWishlistItem(data)
        toast({ title: 'Added to wishlist!' })
      }
      fetchItems()
      return true
    } catch (err) {
      toast({ title: 'Error saving item', variant: 'destructive' })
      return false
    }
  }

  const handleStatusChange = async (id: string, status: WishlistStatus) => {
    try {
      // Optimistic update
      setItems(prev => prev.map(item =>
        item.id === id ? { ...item, status } : item
      ))

      await api.updateWishlistItem(id, { status })
      toast({
        title: status === 'purchased' ? 'Marked as purchased!' : 'Marked as active/wanted',
        description: status === 'purchased' ? 'Enjoy your new gear! 🎁' : undefined
      })
    } catch (err) {
      toast({ title: 'Error updating item', variant: 'destructive' })
      fetchItems() // Revert
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this from your wishlist?')) return
    try {
      await api.deleteWishlistItem(id)
      setItems(prev => prev.filter(item => item.id !== id))
      toast({ title: 'Item removed' })
    } catch (err) {
      toast({ title: 'Error deleting item', variant: 'destructive' })
    }
  }

  const handleEdit = (item: WishlistItem) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingItem(undefined)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wishlist"
        description="Curate your needs and wants. Stay intentional with your spending."
      >
        <Button onClick={() => setIsFormOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </PageHeader>

      <WishlistGrid
        items={items}
        loading={loading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
      />

      <WishlistForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleCreateOrUpdate}
        initialData={editingItem}
      />
    </div>
  )
}
