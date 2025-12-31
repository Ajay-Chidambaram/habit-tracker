'use client'

import { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui'
import { Button, Input, TextArea, Badge, Select } from '@/components/ui'
import type { ExperienceTravel, ExperienceTravelInsert } from '@/types/api'

interface ExperiencesSectionProps {
  experiences: ExperienceTravel[]
  onUpdate: (experiences: (Omit<ExperienceTravelInsert, 'entry_id'> | ExperienceTravel)[]) => void
  disabled?: boolean
}

const typeOptions = [
  { value: 'travel', label: 'Travel' },
  { value: 'event', label: 'Event' },
  { value: 'experience', label: 'Experience' },
]

const statusOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'booked', label: 'Booked' },
  { value: 'completed', label: 'Completed' },
]

export function ExperiencesSection({
  experiences,
  onUpdate,
  disabled = false,
}: ExperiencesSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newExperience, setNewExperience] = useState({
    title: '',
    planned_date: '',
    type: 'experience' as const,
    status: 'planning' as const,
    notes: '',
  })

  const handleAdd = () => {
    if (!newExperience.title.trim()) return

    const experienceToAdd: Omit<ExperienceTravelInsert, 'entry_id'> = {
      title: newExperience.title.trim(),
      planned_date: newExperience.planned_date || null,
      type: newExperience.type,
      status: newExperience.status,
      notes: newExperience.notes.trim() || null,
      order_index: experiences.length,
    }

    onUpdate([...experiences, experienceToAdd])
    setNewExperience({
      title: '',
      planned_date: '',
      type: 'experience',
      status: 'planning',
      notes: '',
    })
    setIsAdding(false)
  }

  const handleRemove = (experienceId: string) => {
    onUpdate(experiences.filter((e) => e.id !== experienceId))
  }

  const handleUpdate = (
    experienceId: string,
    updates: Partial<ExperienceTravel>
  ) => {
    onUpdate(
      experiences.map((e) =>
        e.id === experienceId ? { ...e, ...updates } : e
      )
    )
  }

  const getStatusBadgeVariant = (status: string): 'default' | 'success' | 'warning' => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'booked':
        return 'warning'
      default:
        return 'default'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Experiences & Travel
          </h3>
          {!isAdding && !disabled && (
            <Button
              onClick={() => setIsAdding(true)}
              size="sm"
              variant="secondary"
            >
              + Add Experience
            </Button>
          )}
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {experiences.map((experience) => (
            <div
              key={experience.id}
              className="p-4 border border-[var(--border)] rounded-lg bg-[var(--background)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-[var(--foreground)]">
                      {experience.title}
                    </h4>
                    <Badge variant="default">
                      {typeOptions.find((o) => o.value === experience.type)
                        ?.label}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(experience.status)}>
                      {statusOptions.find((o) => o.value === experience.status)
                        ?.label}
                    </Badge>
                  </div>
                  {experience.planned_date && (
                    <div>
                      <span className="text-sm text-[var(--muted-foreground)]">
                        Planned Date:{' '}
                      </span>
                      <span className="text-sm text-[var(--foreground)]">
                        {formatDate(experience.planned_date)}
                      </span>
                    </div>
                  )}
                  {!disabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-[var(--muted-foreground)] mb-1 block">
                          Planned Date
                        </label>
                        <Input
                          type="date"
                          value={
                            experience.planned_date
                              ? experience.planned_date.split('T')[0]
                              : ''
                          }
                          onChange={(e) =>
                            handleUpdate(experience.id, {
                              planned_date: e.target.value || null,
                            })
                          }
                        />
                      </div>
                      <Select
                        value={experience.type}
                        onChange={(e) =>
                          handleUpdate(experience.id, {
                            type: e.target.value as ExperienceTravel['type'],
                          })
                        }
                        options={typeOptions}
                        placeholder="Type"
                      />
                      <Select
                        value={experience.status}
                        onChange={(e) =>
                          handleUpdate(experience.id, {
                            status: e.target.value as ExperienceTravel['status'],
                          })
                        }
                        options={statusOptions}
                        placeholder="Status"
                      />
                    </div>
                  )}
                  {experience.notes && (
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {experience.notes}
                    </p>
                  )}
                  {!disabled && (
                    <TextArea
                      placeholder="Add notes or details..."
                      value={experience.notes || ''}
                      onChange={(e) =>
                        handleUpdate(experience.id, { notes: e.target.value })
                      }
                      rows={2}
                    />
                  )}
                </div>
                {!disabled && (
                  <Button
                    onClick={() => handleRemove(experience.id)}
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
                  placeholder="Experience/trip name"
                  value={newExperience.title}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, title: e.target.value })
                  }
                  autoFocus
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-[var(--muted-foreground)] mb-1 block">
                      Planned Date
                    </label>
                    <Input
                      type="date"
                      value={newExperience.planned_date}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          planned_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Select
                    value={newExperience.type}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        type: e.target.value as ExperienceTravel['type'],
                      })
                    }
                    options={typeOptions}
                    placeholder="Type"
                  />
                  <Select
                    value={newExperience.status}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        status: e.target.value as ExperienceTravel['status'],
                      })
                    }
                    options={statusOptions}
                    placeholder="Status"
                  />
                </div>
                <TextArea
                  placeholder="Details or links (optional)"
                  value={newExperience.notes}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, notes: e.target.value })
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
                      setNewExperience({
                        title: '',
                        planned_date: '',
                        type: 'experience',
                        status: 'planning',
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

          {experiences.length === 0 && !isAdding && (
            <p className="text-center text-[var(--muted-foreground)] py-8">
              No experiences added yet. Click "Add Experience" to get started.
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

