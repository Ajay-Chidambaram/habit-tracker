'use client'

import { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui'
import { Button, Input, TextArea, Badge } from '@/components/ui'
import type { Habit, HabitInsert } from '@/types/api'

interface HabitsSectionProps {
  habits: Habit[]
  onUpdate: (habits: (Omit<HabitInsert, 'entry_id'> | Habit)[]) => void
  disabled?: boolean
}

export function HabitsSection({
  habits,
  onUpdate,
  disabled = false,
}: HabitsSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newHabit, setNewHabit] = useState({
    name: '',
    target_frequency: 1,
    completed_count: 0,
    notes: '',
  })

  const handleAdd = () => {
    if (!newHabit.name.trim()) return

    const habitToAdd: Omit<HabitInsert, 'entry_id'> = {
      name: newHabit.name.trim(),
      target_frequency: newHabit.target_frequency,
      completed_count: newHabit.completed_count,
      notes: newHabit.notes.trim() || null,
      order_index: habits.length,
    }

    onUpdate([...habits, habitToAdd])
    setNewHabit({ name: '', target_frequency: 1, completed_count: 0, notes: '' })
    setIsAdding(false)
  }

  const handleRemove = (habitId: string) => {
    onUpdate(habits.filter((h) => h.id !== habitId))
  }

  const handleUpdate = (habitId: string, updates: Partial<Habit>) => {
    onUpdate(
      habits.map((h) => (h.id === habitId ? { ...h, ...updates } : h))
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Habits
          </h3>
          {!isAdding && !disabled && (
            <Button
              onClick={() => setIsAdding(true)}
              size="sm"
              variant="secondary"
            >
              + Add Habit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="p-4 border border-[var(--border)] rounded-lg bg-[var(--background)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-medium text-[var(--foreground)]">
                      {habit.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-[var(--muted-foreground)]">
                        Target:
                      </label>
                      {disabled ? (
                        <Badge variant="default">
                          {habit.target_frequency} per week
                        </Badge>
                      ) : (
                        <Input
                          type="number"
                          min="1"
                          value={habit.target_frequency}
                          onChange={(e) =>
                            handleUpdate(habit.id, {
                              target_frequency: parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-20"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-[var(--muted-foreground)]">
                        Completed:
                      </label>
                      {disabled ? (
                        <Badge
                          variant={
                            habit.completed_count >= habit.target_frequency
                              ? 'success'
                              : 'default'
                          }
                        >
                          {habit.completed_count} / {habit.target_frequency}
                        </Badge>
                      ) : (
                        <Input
                          type="number"
                          min="0"
                          value={habit.completed_count}
                          onChange={(e) =>
                            handleUpdate(habit.id, {
                              completed_count: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-20"
                        />
                      )}
                    </div>
                  </div>
                  {habit.notes && (
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {habit.notes}
                    </p>
                  )}
                  {!disabled && (
                    <TextArea
                      placeholder="Add notes..."
                      value={habit.notes || ''}
                      onChange={(e) =>
                        handleUpdate(habit.id, { notes: e.target.value })
                      }
                      rows={2}
                    />
                  )}
                </div>
                {!disabled && (
                  <Button
                    onClick={() => handleRemove(habit.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}

          {isAdding && (
            <div className="p-4 border-2 border-dashed border-[var(--border)] rounded-lg">
              <div className="space-y-3">
                <Input
                  placeholder="Habit name"
                  value={newHabit.name}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, name: e.target.value })
                  }
                  autoFocus
                />
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-[var(--muted-foreground)]">
                      Target:
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={newHabit.target_frequency}
                      onChange={(e) =>
                        setNewHabit({
                          ...newHabit,
                          target_frequency: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-20"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-[var(--muted-foreground)]">
                      Completed:
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={newHabit.completed_count}
                      onChange={(e) =>
                        setNewHabit({
                          ...newHabit,
                          completed_count: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-20"
                    />
                  </div>
                </div>
                <TextArea
                  placeholder="Notes (optional)"
                  value={newHabit.notes}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, notes: e.target.value })
                  }
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAdd} size="sm">
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAdding(false)
                      setNewHabit({
                        name: '',
                        target_frequency: 1,
                        completed_count: 0,
                        notes: '',
                      })
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {habits.length === 0 && !isAdding && (
            <p className="text-center text-[var(--muted-foreground)] py-8">
              No habits added yet. Click "Add Habit" to get started.
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

