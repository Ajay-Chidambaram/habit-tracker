
'use client'
import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { BucketListGrid } from '@/components/bucket-list/bucket-list-grid'
import { BucketForm } from '@/components/bucket-list/bucket-form'
import { api } from '@/lib/api/bucket-list'
import { BucketListItem, CreateBucketItemInput } from '@/types'
import { Button } from '@/components/ui/button'
import { Plus, Compass } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'

export default function BucketListPage() {
  const [items, setItems] = useState<BucketListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BucketListItem | undefined>(undefined)
  const { toast } = useToast()

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.fetchBucketItems()
      setItems(data)
    } catch (err) {
      console.error(err)
      toast({ title: 'Error fetching bucket list', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleCreateOrUpdate = async (data: CreateBucketItemInput) => {
    try {
      if (editingItem) {
        await api.updateBucketItem(editingItem.id, data)
        toast({ title: 'Item updated' })
      } else {
        await api.createBucketItem(data)
        toast({ title: 'Added to bucket list!' })
      }
      fetchItems()
      return true
    } catch (err) {
      toast({ title: 'Error saving item', variant: 'destructive' })
      return false
    }
  }

  const handleToggle = async (id: string, isCompleted: boolean) => {
    try {
      // Optimistic update
      setItems(prev => prev.map(item =>
        item.id === id ? { ...item, is_completed: isCompleted } : item
      ))

      await api.updateBucketItem(id, { is_completed: isCompleted })
      toast({
        title: isCompleted ? 'Marked as completed!' : 'Marked as active',
        description: isCompleted ? 'One more off the list! 🚀' : undefined
      })
      fetchItems() // Sync with server for completed_at
    } catch (err) {
      toast({ title: 'Error updating item', variant: 'destructive' })
      fetchItems() // Revert
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this from your bucket list?')) return
    try {
      await api.deleteBucketItem(id)
      setItems(prev => prev.filter(item => item.id !== id))
      toast({ title: 'Item removed' })
    } catch (err) {
      toast({ title: 'Error deleting item', variant: 'destructive' })
    }
  }

  const handleEdit = (item: BucketListItem) => {
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
        title="Bucket List"
        description="Life experiences to collect and goals to achieve."
      >
        <Button onClick={() => setIsFormOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </PageHeader>

      <div className="grid gap-6">
        <BucketListGrid
          items={items}
          loading={loading}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      <BucketForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleCreateOrUpdate}
        initialData={editingItem}
      />
    </div>
  )
}
