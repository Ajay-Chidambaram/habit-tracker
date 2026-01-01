
import { useState, useEffect } from 'react'
import { Project, CreateProjectInput, UpdateProjectInput, ProjectStatus, Goal } from '@/types'
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

interface ProjectFormProps {
  initialData?: Project
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<boolean>
  goals?: Goal[]
}

const STATUSES: { id: ProjectStatus; label: string }[] = [
  { id: 'idea', label: 'Idea' },
  { id: 'planned', label: 'Planned' },
  { id: 'active', label: 'Active' },
  { id: 'paused', label: 'Paused' },
  { id: 'completed', label: 'Done' }
]

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e']

export function ProjectForm({ initialData, isOpen, onClose, onSubmit, goals = [] }: ProjectFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    status: 'idea',
    color: '#3b82f6',
    icon: '📁',
    goal_id: undefined
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        status: initialData.status,
        color: initialData.color,
        icon: initialData.icon,
        goal_id: initialData.goal_id || undefined
      })
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'idea',
        color: '#3b82f6',
        icon: '📁',
        goal_id: undefined
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
      title={initialData ? "Edit Project" : "New Project"}
      description={initialData ? "Update your project mission." : "Create a new project to organize your efforts."}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Name</label>
          <Input
            placeholder="e.g. Personal Portfolio v2"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mission / Description</label>
          <Input
            placeholder="e.g. Build a high-performance portfolio with Next.js"
            value={formData.description || ''}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {STATUSES.find(s => s.id === formData.status)?.label}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {STATUSES.map(status => (
                  <DropdownMenuItem
                    key={status.id}
                    onClick={() => setFormData({ ...formData, status: status.id })}
                  >
                    {status.label}
                    {formData.status === status.id && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Link to Goal (Optional)</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between truncate">
                  {formData.goal_id
                    ? goals.find(g => g.id === formData.goal_id)?.title
                    : "No Goal Linked"}
                  <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px] max-h-[300px] overflow-y-auto">
                <DropdownMenuItem onClick={() => setFormData({ ...formData, goal_id: undefined })}>
                  None
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {goals.map(goal => (
                  <DropdownMenuItem
                    key={goal.id}
                    onClick={() => setFormData({ ...formData, goal_id: goal.id })}
                  >
                    <span className="truncate">{goal.title}</span>
                    {formData.goal_id === goal.id && <Check className="ml-auto h-4 w-4 flex-shrink-0" />}
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
            {loading ? 'Saving...' : (initialData ? 'Update Project' : 'Launch Project')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
