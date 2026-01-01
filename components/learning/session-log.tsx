
import { useState } from 'react'
import { LearningSession, CreateSessionInput } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Clock, Plus, History } from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface SessionLogProps {
  sessions: LearningSession[]
  unitName: string
  onAdd: (data: CreateSessionInput) => Promise<void>
}

export function SessionLog({ sessions, unitName, onAdd }: SessionLogProps) {
  const [formData, setFormData] = useState<CreateSessionInput>({
    duration_minutes: 30,
    units_completed: 0,
    notes: '',
    session_date: new Date().toISOString().split('T')[0]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onAdd(formData)
    setFormData({
      ...formData,
      units_completed: 0,
      notes: ''
    })
    setIsSubmitting(false)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Log Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" /> Log Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">Date</label>
                <Input
                  type="date"
                  value={formData.session_date}
                  onChange={e => setFormData({ ...formData, session_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Duration (min)</label>
                <Input
                  type="number"
                  min={1}
                  value={formData.duration_minutes}
                  onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">{unitName} completed (optional)</label>
              <Input
                type="number"
                min={0}
                value={formData.units_completed}
                onChange={e => setFormData({ ...formData, units_completed: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">Notes</label>
              <Input
                placeholder="What did you learn?"
                value={formData.notes || ''}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging...' : 'Log Session'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* History List */}
      <Card className="h-full max-h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <History className="w-4 h-4" /> Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pr-2">
          <div className="relative border-l border-border ml-2 space-y-6 pl-4 pb-2">
            {sessions.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No sessions logged yet.</p>
            )}
            {sessions.map((session) => (
              <div key={session.id} className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-bg-elevated" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {format(parseISO(session.session_date), 'MMM d, yyyy')}
                  </span>
                  <p className="text-sm font-medium">
                    {session.duration_minutes} mins
                    {session.units_completed > 0 && ` • ${session.units_completed} ${unitName}`}
                  </p>
                  {session.notes && (
                    <p className="text-xs text-muted-foreground">{session.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
