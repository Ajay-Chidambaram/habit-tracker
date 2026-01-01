
import { Project } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MoreVertical, Trash2, Edit2, Folder } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown'
import { Button } from '@/components/ui/button'

interface ProjectCardProps {
  project: Project
  onDelete: (id: string) => void
  onEdit: (project: Project) => void
}

const STATUS_COLORS: Record<string, string> = {
  idea: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  planned: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  paused: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  completed: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
}

export function ProjectCard({ project, onDelete, onEdit }: ProjectCardProps) {
  return (
    <Card className="group relative flex flex-col p-5 transition-all hover:shadow-lg border-t-4" style={{ borderTopColor: project.color }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{project.icon}</span>
          <h3 className="font-bold leading-tight line-clamp-1">{project.name}</h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-1">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(project)}>
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(project.id)}
              className="text-red-500 focus:text-red-500"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {project.description && (
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {project.description}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] uppercase font-bold py-0 h-5",
            STATUS_COLORS[project.status] || 'text-muted-foreground'
          )}
        >
          {project.status.replace('_', ' ')}
        </Badge>

        <div className="flex -space-x-2">
          {/* Linked items icons could go here */}
          {project.goal_id && (
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border-2 border-background" title="Linked to a goal">
              <Folder className="w-3 h-3 text-primary" />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
