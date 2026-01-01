
'use client'
import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { ProjectBoard } from '@/components/projects/project-board'
import { ProjectForm } from '@/components/projects/project-form'
import { api as projectApi } from '@/lib/api/projects'
import { api as goalApi } from '@/lib/api/goals'
import { Project, CreateProjectInput, ProjectStatus, Goal } from '@/types'
import { Button } from '@/components/ui/button'
import { Plus, Layout } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [projectsData, goalsData] = await Promise.all([
        projectApi.fetchProjects(),
        goalApi.fetchGoals()
      ])
      setProjects(projectsData)
      setGoals(goalsData)
    } catch (err) {
      console.error(err)
      toast({ title: 'Error fetching projects', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreateOrUpdate = async (data: CreateProjectInput) => {
    try {
      if (editingProject) {
        await projectApi.updateProject(editingProject.id, data)
        toast({ title: 'Project updated' })
      } else {
        await projectApi.createProject(data)
        toast({ title: 'Project launched! 🚀' })
      }
      fetchData()
      return true
    } catch (err) {
      toast({ title: 'Error saving project', variant: 'destructive' })
      return false
    }
  }

  const handleStatusChange = async (id: string, status: ProjectStatus) => {
    try {
      // Optimistic update
      setProjects(prev => prev.map(p =>
        p.id === id ? { ...p, status } : p
      ))

      await projectApi.updateProject(id, { status })
      toast({ title: `Moved to ${status}` })
    } catch (err) {
      toast({ title: 'Error updating project', variant: 'destructive' })
      fetchData() // Revert
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Abort this project? This will permanently delete it.')) return
    try {
      await projectApi.deleteProject(id)
      setProjects(prev => prev.filter(p => p.id !== id))
      toast({ title: 'Project deleted' })
    } catch (err) {
      toast({ title: 'Error deleting project', variant: 'destructive' })
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingProject(undefined)
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <PageHeader
        title="Projects"
        description="Organize your larger missions and track their status."
      >
        <Button onClick={() => setIsFormOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </PageHeader>

      <div className="flex-1 min-h-0">
        <ProjectBoard
          projects={projects}
          loading={loading}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
        />
      </div>

      <ProjectForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleCreateOrUpdate}
        initialData={editingProject}
        goals={goals}
      />
    </div>
  )
}
