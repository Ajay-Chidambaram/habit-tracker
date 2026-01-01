
import { useState, useEffect } from 'react'
import { BucketListItem, CreateBucketItemInput, BucketCategory, BucketPriority } from '@/types'
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
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface BucketFormProps {
  initialData?: BucketListItem
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateBucketItemInput) => Promise<boolean>
}

const CATEGORIES: BucketCategory[] = ['travel', 'achievement', 'experience', 'skill', 'creative', 'adventure']
const PRIORITIES: BucketPriority[] = ['this_year', 'soon', 'someday', 'bucket']
const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e']

export function BucketForm({ initialData, isOpen, onClose, onSubmit }: BucketFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateBucketItemInput>({
    title: '',
    description: '',
    category: 'travel',
    priority: 'someday',
    icon: '🌟',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        category: initialData.category,
        priority: initialData.priority,
        icon: initialData.icon,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'travel',
        priority: 'someday',
        icon: '🌟',
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
      title={initialData ? "Edit Adventure" : "New Adventure"}
      description={initialData ? "Update your bucket list item." : "Add a new experience or milestone to your list."}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">What is it?</label>
          <Input
            placeholder="e.g. Scuba diving in Maldives"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description (Optional)</label>
          <Input
            placeholder="e.g. Visit Maaya Thila and see whale sharks"
            value={formData.description || ''}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between capitalize">
                  {formData.category || 'travel'}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuLabel>Select Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between capitalize">
                  {(formData.priority || 'someday').replace('_', ' ')}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuLabel>How soon?</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {PRIORITIES.map(prio => (
                  <DropdownMenuItem
                    key={prio}
                    onClick={() => setFormData({ ...formData, priority: prio })}
                    className="capitalize"
                  >
                    {prio.replace('_', ' ')}
                    {formData.priority === prio && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Icon</label>
          <Input
            value={formData.icon}
            onChange={e => setFormData({ ...formData, icon: e.target.value })}
            className="w-12 text-center text-lg"
            maxLength={2}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (initialData ? 'Update Item' : 'Add to List')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
