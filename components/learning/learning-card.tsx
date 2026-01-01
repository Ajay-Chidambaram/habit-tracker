
import { LearningItemWithSessions } from '@/types'
import { Card } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Badge } from '@/components/ui/badge'
import { Clock, BookOpen, MoreVertical, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'

interface LearningCardProps {
  item: LearningItemWithSessions
}

export function LearningCard({ item }: LearningCardProps) {
  const isCompleted = item.status === 'completed'
  const progress = Math.min(100, Math.round((item.completed_units / item.total_units) * 100))

  return (
    <Link href={`/learning/${item.id}`}>
      <Card
        className={cn(
          "group relative flex flex-col p-4 transition-all hover:shadow-lg active:scale-[0.99] h-full border-l-4",
          isCompleted && "opacity-75"
        )}
        style={{ borderLeftColor: item.color }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label="icon">{item.icon}</span>
            <div>
              <h3 className="font-semibold leading-tight line-clamp-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
            </div>
          </div>
          <Badge variant="outline" className={cn(
            "capitalize text-[10px] px-1.5 py-0 h-5",
            item.status === 'active' ? "bg-green-500/10 text-green-500 border-green-500/20" :
              item.status === 'completed' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                "text-muted-foreground"
          )}>
            {item.status.replace('_', ' ')}
          </Badge>
        </div>

        <div className="mt-auto space-y-3 pt-2">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progress}% Completed</span>
              <span>{item.completed_units} / {item.total_units} {item.unit_name}</span>
            </div>
            <ProgressBar value={progress} max={100} color={item.color} className="h-1.5" />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{Math.round(item.total_time_minutes / 60)}h {item.total_time_minutes % 60}m</span>
            </div>
            {item.status === 'active' && (
              <div className="flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Log Session</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
