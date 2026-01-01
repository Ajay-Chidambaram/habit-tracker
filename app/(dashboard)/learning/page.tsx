
'use client'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { LearningList } from '@/components/learning/learning-list'
import { LearningForm } from '@/components/learning/learning-form'
import { useLearning } from '@/lib/hooks/use-learning'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CreateLearningInput } from '@/types'

export default function LearningPage() {
  const { items, loading, addItem } = useLearning()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleCreate = async (data: CreateLearningInput) => {
    return await addItem(data)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning"
        description="Track your skills, courses, and reading list."
      >
        <Button onClick={() => setIsFormOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Item
        </Button>
      </PageHeader>

      <LearningList
        items={items}
        loading={loading}
      />

      <LearningForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}
