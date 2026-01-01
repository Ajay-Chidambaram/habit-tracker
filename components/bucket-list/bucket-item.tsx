
import { BucketListItem } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, MoreVertical, Trash2, Edit2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown'
import { Button } from '@/components/ui/button'

interface BucketItemProps {
  item: BucketListItem
  onToggle: (id: string, isCompleted: boolean) => void
  onDelete: (id: string) => void
  onEdit: (item: BucketListItem) => void
}

const PRIORITY_COLORS: Record<string, string> = {
  this_year: 'bg-red-500/10 text-red-500 border-red-500/20',
  soon: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  someday: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
}

export function BucketItem({ item, onToggle, onDelete, onEdit }: BucketItemProps) {
  const isCompleted = item.is_completed

  return (
    <Card className={cn(
      "group relative flex flex-col p-4 transition-all hover:shadow-md",
      isCompleted && "opacity-60 grayscale-[0.5]"
    )}>
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggle(item.id, !isCompleted)}
            className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none">{item.icon}</span>
            <h3 className={cn(
              "font-semibold leading-tight line-clamp-1",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {item.title}
            </h3>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-1">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(item.id)}
              className="text-red-500 focus:text-red-500"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {item.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 px-8">
          {item.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 pl-8">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-5 border-border/50">
            {item.category}
          </Badge>
          {!isCompleted && (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] uppercase font-bold py-0 h-5",
                PRIORITY_COLORS[item.priority] || 'text-muted-foreground'
              )}
            >
              {item.priority.replace('_', ' ')}
            </Badge>
          )}
        </div>

        {isCompleted && item.completed_at && (
          <span className="text-[10px] text-muted-foreground font-medium">
            Done on {new Date(item.completed_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </Card>
  )
}
