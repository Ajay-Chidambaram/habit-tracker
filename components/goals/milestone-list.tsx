
import { useState } from 'react'
import { GoalMilestone } from '@/types'
import { MilestoneItem } from './milestone-item'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface MilestoneListProps {
  milestones: GoalMilestone[]
  loading?: boolean
  onAdd: (title: string) => Promise<void>
  onToggle: (id: string, isCompleted: boolean) => void
  onDelete: (id: string) => void
}

export function MilestoneList({ milestones, loading, onAdd, onToggle, onDelete }: MilestoneListProps) {
  const [newTitle, setNewTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    setIsAdding(true)
    await onAdd(newTitle)
    setNewTitle('')
    setIsAdding(false)
  }

  if (loading) {
    return <div className="space-y-2">
      {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full rouned-lg" />)}
    </div>
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {milestones.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4 italic">
            No milestones yet. Break it down!
          </p>
        )}
        {milestones.map(milestone => (
          <MilestoneItem
            key={milestone.id}
            milestone={milestone}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Add a new milestone..."
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          className="flex-1"
          disabled={isAdding}
        />
        <Button type="submit" size="icon" disabled={isAdding || !newTitle.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
