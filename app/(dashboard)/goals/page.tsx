
'use client'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { GoalList } from '@/components/goals/goal-list'
import { GoalForm } from '@/components/goals/goal-form'
import { useGoals } from '@/lib/hooks/use-goals'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CreateGoalInput } from '@/types'

export default function GoalsPage() {
  const { goals, loading, addGoal } = useGoals()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleCreate = async (data: CreateGoalInput) => {
    return await addGoal(data)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goals"
        description="Set ambitious goals and track your journey."
      >
        <Button onClick={() => setIsFormOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </PageHeader>

      <GoalList
        goals={goals}
        loading={loading}
      />

      <GoalForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}
