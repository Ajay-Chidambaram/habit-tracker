'use client'

import { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui'
import { Button, Input, TextArea, Badge, Select } from '@/components/ui'
import type { SideProject, SideProjectInsert } from '@/types/api'

interface ProjectsSectionProps {
  projects: SideProject[]
  onUpdate: (projects: (Omit<SideProjectInsert, 'entry_id'> | SideProject)[]) => void
  disabled?: boolean
}

const statusOptions = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

export function ProjectsSection({
  projects,
  onUpdate,
  disabled = false,
}: ProjectsSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newProject, setNewProject] = useState<{
    name: string
    goal: string
    status: 'not_started' | 'in_progress' | 'completed'
    notes: string
  }>({
    name: '',
    goal: '',
    status: 'not_started',
    notes: '',
  })

  const handleAdd = () => {
    if (!newProject.name.trim() || !newProject.goal.trim()) return

    const projectToAdd: Omit<SideProjectInsert, 'entry_id'> = {
      name: newProject.name.trim(),
      goal: newProject.goal.trim(),
      status: newProject.status,
      notes: newProject.notes.trim() || null,
      order_index: projects.length,
    }

    onUpdate([...projects, projectToAdd])
    setNewProject({
      name: '',
      goal: '',
      status: 'not_started',
      notes: '',
    })
    setIsAdding(false)
  }

  const handleRemove = (projectId: string) => {
    onUpdate(projects.filter((p) => p.id !== projectId))
  }

  const handleUpdate = (projectId: string, updates: Partial<SideProject>) => {
    onUpdate(
      projects.map((p) => (p.id === projectId ? { ...p, ...updates } : p))
    )
  }

  const getStatusBadgeVariant = (status: string): 'default' | 'warning' | 'success' => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in_progress':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Side Projects
          </h3>
          {!isAdding && !disabled && (
            <Button
              onClick={() => setIsAdding(true)}
              size="sm"
              variant="secondary"
            >
              + Add Project
            </Button>
          )}
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border border-[var(--border)] rounded-lg bg-[var(--background)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-[var(--foreground)]">
                      {project.name}
                    </h4>
                    <Badge variant={getStatusBadgeVariant(project.status)}>
                      {statusOptions.find((o) => o.value === project.status)?.label}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--muted-foreground)]">
                      Weekly Goal:
                    </label>
                    {disabled ? (
                      <p className="text-[var(--foreground)] mt-1">
                        {project.goal}
                      </p>
                    ) : (
                      <Input
                        value={project.goal || ''}
                        onChange={(e) =>
                          handleUpdate(project.id, { goal: e.target.value })
                        }
                        className="mt-1"
                        placeholder="What do you want to achieve this week?"
                      />
                    )}
                  </div>
                  {!disabled && (
                    <Select
                      value={project.status}
                      onChange={(e) =>
                        handleUpdate(project.id, {
                          status: e.target.value as SideProject['status'],
                        })
                      }
                      options={statusOptions}
                      placeholder="Select status"
                    />
                  )}
                  {project.notes && (
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {project.notes}
                    </p>
                  )}
                  {!disabled && (
                    <TextArea
                      placeholder="Add notes..."
                      value={project.notes || ''}
                      onChange={(e) =>
                        handleUpdate(project.id, { notes: e.target.value })
                      }
                      rows={2}
                    />
                  )}
                </div>
                {!disabled && (
                  <Button
                    onClick={() => handleRemove(project.id)}
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
                  placeholder="Project name"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  autoFocus
                />
                <Input
                  placeholder="Weekly goal"
                  value={newProject.goal}
                  onChange={(e) =>
                    setNewProject({ ...newProject, goal: e.target.value })
                  }
                />
                <Select
                  value={newProject.status}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      status: e.target.value as SideProject['status'],
                    })
                  }
                  options={statusOptions}
                  placeholder="Select status"
                />
                <TextArea
                  placeholder="Notes (optional)"
                  value={newProject.notes}
                  onChange={(e) =>
                    setNewProject({ ...newProject, notes: e.target.value })
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
                      setNewProject({
                        name: '',
                        goal: '',
                        status: 'not_started',
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

          {projects.length === 0 && !isAdding && (
            <p className="text-center text-[var(--muted-foreground)] py-8">
              No projects added yet. Click &quot;Add Project&quot; to get started.
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

