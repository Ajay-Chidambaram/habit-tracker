
import { useState, useEffect } from 'react'
import { LearningItem, CreateLearningInput, LearningType } from '@/types'
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

interface LearningFormProps {
  initialData?: LearningItem
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateLearningInput) => Promise<boolean>
}

const TYPES: LearningType[] = ['skill', 'book', 'course', 'project', 'certification']
const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e']

export function LearningForm({ initialData, isOpen, onClose, onSubmit }: LearningFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateLearningInput>({
    title: '',
    description: '',
    type: 'course',
    total_units: 100,
    unit_name: 'percent',
    url: '',
    icon: '📚',
    color: '#8b5cf6'
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        type: initialData.type,
        total_units: initialData.total_units,
        unit_name: initialData.unit_name,
        url: initialData.url || '',
        icon: initialData.icon,
        color: initialData.color
      })
    } else {
      // Reset or use defaults
      setFormData({
        title: '',
        description: '',
        type: 'course',
        total_units: 100,
        unit_name: 'percent',
        url: '',
        icon: '📚',
        color: '#8b5cf6'
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

  // Helper to suggest unit name based on type
  const handleTypeChange = (type: LearningType) => {
    let unit = 'percent'
    let total = 100
    let icon = '📚'

    switch (type) {
      case 'book': unit = 'pages'; total = 300; icon = '📖'; break;
      case 'course': unit = 'modules'; total = 10; icon = '🎓'; break;
      case 'skill': unit = 'hours'; total = 20; icon = '⚡'; break;
      case 'project': unit = 'tasks'; total = 10; icon = '🔨'; break;
      case 'certification': unit = 'percent'; total = 100; icon = '🏆'; break;
    }

    setFormData({
      ...formData,
      type,
      unit_name: unit,
      total_units: total,
      icon: formData.icon === '📚' ? icon : formData.icon // Only update icon if it was default
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Learning Item" : "New Learning Item"}
      description={initialData ? "Update details." : "What do you want to learn next?"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            placeholder="e.g. Advanced React Patterns"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description (Optional)</label>
          <Input
            placeholder="e.g. Frontend Masters course"
            value={formData.description || ''}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between capitalize">
                  {formData.type}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuLabel>Select Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {TYPES.map(t => (
                  <DropdownMenuItem
                    key={t}
                    onClick={() => handleTypeChange(t)}
                    className="capitalize"
                  >
                    {t}
                    {formData.type === t && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Total Resource URL</label>
            <Input
              placeholder="https://..."
              value={formData.url || ''}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Total Units</label>
            <Input
              type="number"
              min={1}
              value={formData.total_units}
              onChange={e => setFormData({ ...formData, total_units: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Unit Name</label>
            <Input
              placeholder="e.g. chapters, pages"
              value={formData.unit_name}
              onChange={e => setFormData({ ...formData, unit_name: e.target.value })}
            />
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
            {loading ? 'Saving...' : (initialData ? 'Update Item' : 'Create Item')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
