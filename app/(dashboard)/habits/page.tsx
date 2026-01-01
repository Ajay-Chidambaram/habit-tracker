
'use client'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { HabitList } from '@/components/habits/habit-list'
import { HabitForm } from '@/components/habits/habit-form'
import { useHabits } from '@/lib/hooks/use-habits'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { HabitWithCompletions, CreateHabitInput } from '@/types'

export default function HabitsPage() {
  const { habits, loading, addHabit, updateHabit, deleteHabit, toggleHabit } = useHabits()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<HabitWithCompletions | undefined>(undefined)

  const handleCreate = async (data: CreateHabitInput) => {
    return await addHabit(data)
  }

  const handleUpdate = async (data: CreateHabitInput) => {
    if (!editingHabit) return false
    return await updateHabit(editingHabit.id, data)
  }

  const openNewHabit = () => {
    setEditingHabit(undefined)
    setIsFormOpen(true)
  }

  const openEditHabit = (habit: HabitWithCompletions) => {
    setEditingHabit(habit)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Habits"
        description="Track your daily routines and build consistency."
      >
        <Button onClick={openNewHabit} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Habit
        </Button>
      </PageHeader>

      <div className="max-w-3xl">
        <HabitList
          habits={habits}
          loading={loading}
          onToggle={toggleHabit}
          onEdit={openEditHabit}
          onDelete={deleteHabit}
        />
      </div>

      <HabitForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={editingHabit ? handleUpdate : handleCreate}
        initialData={editingHabit}
      />
    </div>
  )
}
