
import { Project, ProjectStatus } from '@/types'
import { ProjectCard } from './project-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, MoreHorizontal } from 'lucide-react'
import { useMemo } from 'react'

interface ProjectBoardProps {
  projects: Project[]
  loading?: boolean
  onDelete: (id: string) => void
  onEdit: (project: Project) => void
  onStatusChange: (id: string, status: ProjectStatus) => void
}

const COLUMNS: { id: ProjectStatus; label: string }[] = [
  { id: 'idea', label: 'Idea' },
  { id: 'planned', label: 'Planned' },
  { id: 'active', label: 'Active' },
  { id: 'paused', label: 'Paused' },
  { id: 'completed', label: 'Done' }
]

export function ProjectBoard({ projects, loading, onDelete, onEdit, onStatusChange }: ProjectBoardProps) {
  const columnData = useMemo(() => {
    return COLUMNS.map(col => ({
      ...col,
      items: projects.filter(p => p.status === col.id)
    }))
  }, [projects])

  if (loading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4 px-1 min-h-[500px]">
        {COLUMNS.map(col => (
          <div key={col.id} className="min-w-[300px] w-[300px] space-y-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 px-1 min-h-[600px] snap-x">
      {columnData.map(column => (
        <div key={column.id} className="min-w-[320px] w-[320px] flex flex-col bg-bg-elevated/30 rounded-2xl p-4 snap-center">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                {column.label}
              </h3>
              <span className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                {column.items.length}
              </span>
            </div>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
            {column.items.length === 0 ? (
              <div className="h-20 flex items-center justify-center border-2 border-dashed border-muted rounded-xl text-xs text-muted-foreground italic">
                No projects here
              </div>
            ) : (
              column.items.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
