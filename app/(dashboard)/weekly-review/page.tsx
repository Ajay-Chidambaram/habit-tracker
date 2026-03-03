'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns'
import { ArrowLeft, ArrowRight, Check, ClipboardList, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHabits } from '@/lib/hooks/use-habits'
import { useGoals } from '@/lib/hooks/use-goals'
import { useWeeklyReview } from '@/lib/hooks/use-weekly-review'
import { toISODate } from '@/lib/utils/dates'
import { SaveWeeklyReviewInput } from '@/types'
import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton'

// Last Monday (week we're reviewing)
function getLastWeekStart(): Date {
  const now = new Date()
  const thisWeekMonday = startOfWeek(now, { weekStartsOn: 1 })
  // If today is Monday return last week's Monday, otherwise return this week's Monday
  const today = now.getDay()
  if (today === 1) {
    // today is Monday — review the week that just ended
    const d = new Date(thisWeekMonday)
    d.setDate(d.getDate() - 7)
    return d
  }
  return thisWeekMonday
}

function StarRating({
  value,
  onChange,
}: {
  value: number | null
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(null)}
          className="transition-transform active:scale-90"
        >
          <Star
            className={cn(
              "h-8 w-8 transition-colors",
              (hovered ?? value ?? 0) >= n
                ? "text-yellow-400 fill-yellow-400"
                : "text-border"
            )}
          />
        </button>
      ))}
    </div>
  )
}

type Step = 1 | 2 | 3

export default function WeeklyReviewPage() {
  const weekStart = getLastWeekStart()
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
  const weekStartISO = toISODate(weekStart)

  const { habits, loading: habitsLoading } = useHabits()
  const { goals, loading: goalsLoading } = useGoals()
  const { review, loading: reviewLoading, saveReview } = useWeeklyReview(weekStartISO)

  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<SaveWeeklyReviewInput>({
    week_start: weekStartISO,
    what_went_well: review?.what_went_well ?? '',
    what_to_improve: review?.what_to_improve ?? '',
    next_week_intention: review?.next_week_intention ?? '',
    week_rating: review?.week_rating ?? null,
  })

  // Populate from saved review once loaded
  const [hydrated, setHydrated] = useState(false)
  if (!reviewLoading && !habitsLoading && !hydrated && review) {
    setForm({
      week_start: weekStartISO,
      what_went_well: review.what_went_well ?? '',
      what_to_improve: review.what_to_improve ?? '',
      next_week_intention: review.next_week_intention ?? '',
      week_rating: review.week_rating ?? null,
    })
    setHydrated(true)
  }

  // Week stats
  const weekCompletions = habits.flatMap(h =>
    (h.completions ?? []).filter(c => {
      const d = parseISO(c.completed_date)
      return isWithinInterval(d, { start: weekStart, end: weekEnd })
    })
  )

  const habitsCompletedThisWeek = new Set(weekCompletions.map(c => c.habit_id)).size
  const totalHabits = habits.length
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.current_streak ?? 0), 0)
  const activeGoals = goals.filter(g => g.status === 'active').length

  const handleSave = async () => {
    setSaving(true)
    const ok = await saveReview(form)
    setSaving(false)
    if (ok) setStep(3)
  }

  const dateLabel = `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d, yyyy')}`

  const loading = habitsLoading || goalsLoading || reviewLoading

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
          <ClipboardList className="h-4 w-4" />
          Weekly Review
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2">
        {([1, 2, 3] as Step[]).map((s, idx) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn(
              "h-2 flex-1 rounded-full transition-colors duration-300",
              step >= s ? "bg-accent-green" : "bg-border"
            )} />
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-1 space-y-6"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Step 1 of 3</p>
              <h1 className="text-2xl font-bold text-text">This Week</h1>
              <p className="text-sm text-text-muted mt-1">{dateLabel}</p>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Habits completed"
                  value={weekCompletions.length}
                  sub={`${habitsCompletedThisWeek} unique`}
                  color="text-accent-green"
                />
                <StatCard
                  label="Best streak"
                  value={bestStreak}
                  sub="days in a row"
                  color="text-orange-400"
                />
                <StatCard
                  label="Total habits"
                  value={totalHabits}
                  sub="tracked"
                  color="text-blue-400"
                />
                <StatCard
                  label="Active goals"
                  value={activeGoals}
                  sub="in progress"
                  color="text-purple-400"
                />
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-accent-green text-white font-semibold hover:bg-accent-green/90 transition-colors"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-1 space-y-6"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Step 2 of 3</p>
              <h1 className="text-2xl font-bold text-text">Reflect</h1>
              <p className="text-sm text-text-muted mt-1">Take a moment to look back.</p>
            </div>

            <div className="space-y-5">
              <ReflectionField
                label="What went well this week?"
                placeholder="Wins, progress, moments you're proud of…"
                value={form.what_went_well}
                onChange={v => setForm(f => ({ ...f, what_went_well: v }))}
              />
              <ReflectionField
                label="What was challenging?"
                placeholder="Obstacles, missed habits, hard moments…"
                value={form.what_to_improve}
                onChange={v => setForm(f => ({ ...f, what_to_improve: v }))}
              />
              <ReflectionField
                label="What's your main focus next week?"
                placeholder="One intention or goal to carry forward…"
                value={form.next_week_intention}
                onChange={v => setForm(f => ({ ...f, next_week_intention: v }))}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-text">How would you rate this week?</label>
                <StarRating
                  value={form.week_rating}
                  onChange={v => setForm(f => ({ ...f, week_rating: v }))}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-2xl border border-border text-text font-semibold hover:bg-bg-elevated transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-accent-green text-white font-semibold hover:bg-accent-green/90 transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save Review'}
                {!saving && <Check className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-12"
          >
            <div className="p-5 rounded-full bg-accent-green/15 text-accent-green">
              <Check className="h-10 w-10" strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-text">Review saved!</h1>
              <p className="text-sm text-text-muted">{dateLabel}</p>
            </div>

            <div className="w-full space-y-3 text-left">
              {form.what_went_well && (
                <SummaryItem label="What went well" value={form.what_went_well} />
              )}
              {form.what_to_improve && (
                <SummaryItem label="Challenges" value={form.what_to_improve} />
              )}
              {form.next_week_intention && (
                <SummaryItem label="Next week focus" value={form.next_week_intention} />
              )}
              {form.week_rating && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-bg-surface border border-border">
                  <span className="text-xs text-text-muted font-medium">Rating</span>
                  <div className="flex gap-1 ml-auto">
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star
                        key={n}
                        className={cn(
                          "h-4 w-4",
                          n <= (form.week_rating ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-border"
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/"
              className="w-full py-3.5 rounded-2xl bg-accent-green text-white font-semibold text-center hover:bg-accent-green/90 transition-colors"
            >
              Back to Dashboard
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: number
  sub: string
  color: string
}) {
  return (
    <div className="p-4 rounded-2xl bg-bg-surface border border-border space-y-1">
      <p className="text-xs text-text-muted font-medium">{label}</p>
      <p className={cn("text-3xl font-bold", color)}>{value}</p>
      <p className="text-xs text-text-muted">{sub}</p>
    </div>
  )
}

function ReflectionField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text">{label}</label>
      <textarea
        rows={3}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border text-text placeholder:text-text-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-green/40 focus:border-accent-green/50 transition-all"
      />
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 rounded-xl bg-bg-surface border border-border space-y-1">
      <p className="text-xs text-text-muted font-medium">{label}</p>
      <p className="text-sm text-text leading-relaxed line-clamp-3">{value}</p>
    </div>
  )
}
