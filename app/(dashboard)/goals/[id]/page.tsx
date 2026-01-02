'use client'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { GoalForm } from '@/components/goals/goal-form'
import { MilestoneList } from '@/components/goals/milestone-list'
import { GoalProgressRing } from '@/components/goals/goal-progress-ring'
import { api } from '@/lib/api/goals'
import { CreateGoalInput } from '@/types'
import { Button } from '@/components/ui/button'
import { Edit, Trash, ArrowLeft, Target, CalendarDays, Flag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useToast } from '@/lib/hooks/use-toast'
import { format, parseISO } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import { useGoal } from '@/lib/hooks/use-goal'

export default function GoalDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { goal, loading, refresh } = useGoal(params.id)
  const [isEditing, setIsEditing] = useState(false)

  // UPDATE Goal
  const handleUpdate = async (data: CreateGoalInput) => {
    try {
      if (!goal) return false
      await api.updateGoal(goal.id, data)
      toast({ title: 'Goal updated successfully' })
      refresh()
      return true
    } catch (err) {
      toast({ title: 'Error updating goal', variant: 'destructive' })
      return false
    }
  }

  // DELETE Goal
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    try {
      await api.deleteGoal(params.id)
      toast({ title: 'Goal deleted' })
      router.push('/goals')
    } catch (err) {
      toast({ title: 'Error deleting goal', variant: 'destructive' })
    }
  }

  // MILESTONE Operations
  const handleAddMilestone = async (title: string) => {
    try {
      if (!goal) return
      await api.createMilestone(goal.id, { title })
      refresh()
      toast({ title: 'Milestone added' })
    } catch (err) {
      toast({ title: 'Error adding milestone', variant: 'destructive' })
    }
  }

  const handleToggleMilestone = async (id: string, isCompleted: boolean) => {
    try {
      await api.updateMilestone(id, { is_completed: isCompleted })
      refresh()
    } catch (err) {
      toast({ title: 'Error updating milestone', variant: 'destructive' })
      refresh() // Revert
    }
  }

  const handleDeleteMilestone = async (id: string) => {
    try {
      await api.deleteMilestone(id)
      refresh()
    } catch (err) {
      toast({ title: 'Error deleting milestone', variant: 'destructive' })
      refresh()
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

  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Goal not found</p>
        <Link href="/goals">
          <Button variant="link">Back to Goals</Button>
        </Link>
      </div>
    )
  }

  const isCompleted = goal.status === 'completed'

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/goals">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{goal.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="capitalize">{goal.category}</span>
              <span>•</span>
              <span className={cn(isCompleted ? "text-green-500 font-medium" : "")}>
                {goal.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Details & Progress */}
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden border-t-4" style={{ borderTopColor: goal.color }}>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <GoalProgressRing
                progress={goal.progress_percent}
                size={120}
                strokeWidth={8}
                color={goal.color}
                className="mb-4"
              />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Progress</p>
                <h2 className="text-3xl font-bold">{goal.progress_percent}%</h2>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goal.description && (
                <div className="text-sm text-muted-foreground">
                  {goal.description}
                </div>
              )}

              <div className="space-y-3 pt-2">
                {goal.target_date && (
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>Target: {format(parseISO(goal.target_date), 'MMM d, yyyy')}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span>{goal.milestones.length} milestones</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Milestones */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-primary" />
                <CardTitle>Milestones</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <MilestoneList
                milestones={goal.milestones}
                onAdd={handleAddMilestone}
                onToggle={handleToggleMilestone}
                onDelete={handleDeleteMilestone}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <GoalForm
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={handleUpdate}
        initialData={goal}
      />
    </div>
  )
}
