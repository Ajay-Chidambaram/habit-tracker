
import { useState, useEffect } from 'react'
import { Habit, CreateHabitInput, HabitCategory, FrequencyType } from '@/types'
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

interface HabitFormProps {
  initialData?: Habit
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateHabitInput) => Promise<boolean>
}

const CATEGORIES: HabitCategory[] = ['health', 'productivity', 'learning', 'personal', 'finance', 'social']
const FREQUENCIES: FrequencyType[] = ['daily', 'times_per_week', 'specific_days']
const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e']

export function HabitForm({ initialData, isOpen, onClose, onSubmit }: HabitFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateHabitInput>({
    name: '',
    description: '',
    icon: '✨',
    color: '#3b82f6',
    category: 'personal',
    frequency_type: 'daily',
    target_duration_minutes: 0
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        icon: initialData.icon,
        color: initialData.color,
        category: initialData.category,
        frequency_type: initialData.frequency_type,
        target_duration_minutes: initialData.target_duration_minutes || 0
      })
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '✨',
        color: '#3b82f6',
        category: 'personal',
        frequency_type: 'daily',
        target_duration_minutes: 0
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
      title={initialData ? "Edit Habit" : "New Habit"}
      description={initialData ? "Update your habit details." : "Create a new habit to track."}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            placeholder="e.g. Morning Run"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description (Optional)</label>
          <Input
            placeholder="e.g. 5km run around the park"
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
                  {formData.category}
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
            <label className="text-sm font-medium">Frequency</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between capitalize">
                  {formData.frequency_type?.replace(/_/g, ' ')}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {FREQUENCIES.map(freq => (
                  <DropdownMenuItem
                    key={freq}
                    onClick={() => setFormData({ ...formData, frequency_type: freq })}
                    className="capitalize"
                  >
                    {freq.replace(/_/g, ' ')}
                    {formData.frequency_type === freq && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Icon & Color</label>
          <div className="flex items-center gap-3">
            <div className="w-12">
              <Input
                value={formData.icon}
                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                className="text-center text-lg"
                maxLength={2}
              />
            </div>
            <div className="flex-1 flex gap-2 overflow-x-auto p-1">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c })}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                    formData.color === c ? "border-white scale-110 ring-2 ring-primary ring-offset-2 ring-offset-bg-elevated" : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (initialData ? 'Update Habit' : 'Create Habit')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
