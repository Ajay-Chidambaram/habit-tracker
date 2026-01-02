'use client'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { HabitHeatmap } from '@/components/habits/habit-heatmap'
import { HabitStats } from '@/components/habits/habit-stats'
import { HabitForm } from '@/components/habits/habit-form'
import { api } from '@/lib/api/habits'
import { CreateHabitInput } from '@/types'
import { Button } from '@/components/ui/button'
import { Edit, Trash, ArrowLeft, History } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useToast } from '@/lib/hooks/use-toast'
import { useHabit } from '@/lib/hooks/use-habit'

export default function HabitDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { habit, loading, refresh } = useHabit(params.id)
  const [isEditing, setIsEditing] = useState(false)

  const handleUpdate = async (data: CreateHabitInput) => {
    try {
      if (!habit) return false
      await api.updateHabit(habit.id, data)
      toast({ title: 'Habit updated successfully' })
      refresh()
      return true
    } catch (err) {
      toast({ title: 'Error updating habit', variant: 'destructive' })
      return false
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this habit?')) return

    try {
      await api.deleteHabit(params.id)
      toast({ title: 'Habit deleted' })
      router.push('/habits')
    } catch (err) {
      toast({ title: 'Error deleting habit', variant: 'destructive' })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!habit) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Habit not found</p>
        <Link href="/habits">
          <Button variant="link">Back to Habits</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <Link href="/habits">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title={habit.name}
          description={habit.description || "Detailed view and history"}
        >
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </PageHeader>
      </div>

      <HabitStats habit={habit} />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">History</h3>
        </div>
        <div className="p-4 border rounded-lg bg-bg-elevated overflow-x-auto">
          <HabitHeatmap
            completions={habit.completions}
            color={habit.color}
            days={365}
            className="min-w-[800px]"
          />
        </div>
      </div>

      <HabitForm
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={handleUpdate}
        initialData={habit}
      />
    </div>
  )
}
