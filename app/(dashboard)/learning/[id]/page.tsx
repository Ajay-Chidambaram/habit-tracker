
'use client'
import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { LearningForm } from '@/components/learning/learning-form'
import { SessionLog } from '@/components/learning/session-log'
import { ProgressChart } from '@/components/learning/progress-chart'
import { api } from '@/lib/api/learning'
import { LearningItemWithSessions, CreateLearningInput, CreateSessionInput } from '@/types'
import { Button } from '@/components/ui/button'
import { Edit, Trash, ArrowLeft, ExternalLink, Timer, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useToast } from '@/lib/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'

export default function LearningDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [item, setItem] = useState<LearningItemWithSessions | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const fetchItem = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.fetchLearningItem(params.id)

      const progress = data.total_units > 0
        ? Math.min(100, Math.round((data.completed_units / data.total_units) * 100))
        : 0

      setItem({ ...data, progress_percent: progress })
    } catch (err) {
      console.error(err)
      toast({ title: 'Error fetching item', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [params.id, toast])

  useEffect(() => {
    fetchItem()
  }, [fetchItem])

  const handleUpdate = async (data: CreateLearningInput) => {
    try {
      if (!item) return false
      await api.updateLearningItem(item.id, data)
      toast({ title: 'Item updated successfully' })
      fetchItem()
      return true
    } catch (err) {
      toast({ title: 'Error updating item', variant: 'destructive' })
      return false
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      await api.deleteLearningItem(params.id)
      toast({ title: 'Item deleted' })
      router.push('/learning')
    } catch (err) {
      toast({ title: 'Error deleting item', variant: 'destructive' })
    }
  }

  const handleLogSession = async (data: CreateSessionInput) => {
    try {
      if (!item) return
      await api.logSession(item.id, data)
      toast({ title: 'Session logged' })
      fetchItem()
    } catch (err) {
      toast({ title: 'Error logging session', variant: 'destructive' })
    }
  }

  const handleStatusChange = async (newStatus: 'active' | 'completed' | 'paused' | 'dropped') => {
    try {
      if (!item) return
      await api.updateLearningItem(item.id, { status: newStatus })
      fetchItem()
    } catch (err) {
      toast({ title: 'Error updating status', variant: 'destructive' })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Item not found</p>
        <Link href="/learning">
          <Button variant="link">Back to Learning</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/learning">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{item.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="capitalize">{item.type}</span>
              <span>•</span>
              <Badge variant="outline" className={cn("capitalize cursor-pointer",
                item.status === 'completed' && "bg-green-500/10 text-green-500 border-green-500/20"
              )}>
                {item.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {item.status !== 'completed' && (
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('completed')} className="text-green-500 hover:text-green-600">
              Mark Complete
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Progress Card */}
          <Card className={cn("border-l-4")} style={{ borderLeftColor: item.color }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-bold">{item.progress_percent}%</span>
                  <span className="text-sm text-muted-foreground mb-1">
                    {item.completed_units} / {item.total_units} {item.unit_name}
                  </span>
                </div>
                <ProgressBar value={item.progress_percent} max={100} color={item.color} className="h-3" />

                <div className="flex gap-6 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Timer className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {Math.floor(item.total_time_minutes / 60)}h {item.total_time_minutes % 60}m invested
                    </span>
                  </div>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <ExternalLink className="w-4 h-4" />
                      Resource Link
                    </a>
                  )}
                </div>

                {item.description && (
                  <p className="text-sm text-muted-foreground border-t pt-3 mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <SessionLog
            sessions={item.sessions}
            unitName={item.unit_name}
            onAdd={handleLogSession}
          />
        </div>

        {/* Sidebar / Stats */}
        <div className="md:col-span-1 space-y-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Activity (14 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressChart sessions={item.sessions} color={item.color} />
            </CardContent>
          </Card>
        </div>
      </div>

      <LearningForm
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={handleUpdate}
        initialData={item}
      />
    </div>
  )
}
