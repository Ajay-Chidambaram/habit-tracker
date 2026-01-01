
import { useState, useEffect } from 'react'
import { WishlistItem, CreateWishlistInput, WishlistCategory } from '@/types'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown'
import { ChevronDown, Check, Tag } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface WishlistFormProps {
  initialData?: WishlistItem
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateWishlistInput) => Promise<boolean>
}

const CATEGORIES: WishlistCategory[] = ['tech', 'home', 'hobby', 'clothing', 'travel', 'general']

export function WishlistForm({ initialData, isOpen, onClose, onSubmit }: WishlistFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateWishlistInput>({
    name: '',
    description: '',
    price: undefined,
    url: '',
    category: 'general',
    priority: 1
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        price: initialData.price || undefined,
        url: initialData.url || '',
        category: initialData.category,
        priority: initialData.priority || 1
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: undefined,
        url: '',
        category: 'general',
        priority: 1
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const success = await onSubmit(formData)
    setLoading(false)
    if (success) {
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Item" : "New Wishlist Item"}
      description={initialData ? "Update item details." : "Add something you've been eyeing."}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Item Name</label>
          <Input
            placeholder="e.g. Mechanical Keyboard"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description (Optional)</label>
          <Input
            placeholder="e.g. 75% layout with tactile switches"
            value={formData.description || ''}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Price (Optional)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.price || ''}
              onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || undefined })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Link (Optional)</label>
            <Input
              placeholder="https://..."
              value={formData.url || ''}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between capitalize">
                  {formData.category || 'general'}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {CATEGORIES.map(cat => (
                  <DropdownMenuItem
                    key={cat}
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className="capitalize"
                  >
                    {cat}
                    {formData.category === cat && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <div className="flex items-center gap-1 h-10 px-3 bg-bg-elevated rounded-md border border-input">
              {[1, 2, 3].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: val })}
                  className="p-1 transition-transform active:scale-90"
                >
                  <Tag className={cn(
                    "w-5 h-5",
                    formData.priority && formData.priority >= val ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"
                  )} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (initialData ? 'Update Item' : 'Add to Wishlist')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
