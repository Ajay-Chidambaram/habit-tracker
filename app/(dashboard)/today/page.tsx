'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, Check, Flame, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHabits } from '@/lib/hooks/use-habits'
import { toISODate } from '@/lib/utils/dates'
import { HabitWithCompletions } from '@/types'
import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton'

function isHabitDueToday(habit: HabitWithCompletions): boolean {
  if (habit.is_archived) return false
  if (habit.frequency_type === 'daily') return true
  const dayOfWeek = new Date().getDay()
  if (habit.frequency_type === 'specific_days') {
    return (habit.frequency_value as number[]).includes(dayOfWeek)
  }
  return true
}

export default function TodayPage() {
  const today = new Date()
  const todayISO = toISODate(today)
  const formattedDate = format(today, 'EEEE, MMMM d')

  const { habits, loading, toggleHabit } = useHabits()

  const todayHabits = habits.filter(isHabitDueToday)
  const completedCount = todayHabits.filter(h => h.is_completed_today).length
  const totalCount = todayHabits.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const isAllDone = totalCount > 0 && completedCount === totalCount

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
          <Zap className="h-4 w-4 text-blue-400" />
          Focus Mode
        </div>
      </div>

      {/* Date + count */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-text">{formattedDate}</h1>
        <p className="text-sm text-text-muted">
          {loading ? 'Loading…' : isAllDone ? 'All done — great work!' : `${completedCount} of ${totalCount} completed`}
        </p>
      </div>

      {/* Progress bar */}
      {!loading && totalCount > 0 && (
        <div className="space-y-1.5">
          <div className="h-2 w-full rounded-full bg-border overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-accent-green"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-text-muted text-right">{Math.round(progress)}%</p>
        </div>
      )}

      {/* Habit list */}
      <div className="flex-1 space-y-3">
        {loading ? (
          <>
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </>
        ) : todayHabits.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 space-y-3">
            <div className="p-4 rounded-full bg-accent-green/10 text-accent-green">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-text">No habits scheduled for today</h3>
            <p className="text-sm text-text-muted">Enjoy your day or add some habits!</p>
            <Link
              href="/habits"
              className="mt-2 text-sm text-accent-green hover:underline"
            >
              Manage habits →
            </Link>
          </div>
        ) : (
          todayHabits.map((habit, idx) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <button
                onClick={() => toggleHabit(habit.id, todayISO, !habit.is_completed_today)}
                className={cn(
                  "w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-200 text-left",
                  habit.is_completed_today
                    ? "bg-accent-green/8 border-accent-green/25"
                    : "bg-bg-surface border-border hover:border-text-muted/40 active:scale-[0.98]"
                )}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: `${habit.color}18`, color: habit.color }}
                  >
                    {habit.icon}
                  </div>

                  {/* Text */}
                  <div className="min-w-0">
                    <p className={cn(
                      "font-semibold text-base leading-tight truncate transition-all",
                      habit.is_completed_today ? "text-text-muted line-through" : "text-text"
                    )}>
                      {habit.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-text-muted">
                      <Flame className={cn(
                        "h-3 w-3",
                        habit.current_streak > 0 ? "text-orange-500 fill-orange-500" : "text-text-muted"
                      )} />
                      <span>{habit.current_streak} day streak</span>
                    </div>
                  </div>
                </div>

                {/* Check button */}
                <div className={cn(
                  "ml-4 h-11 w-11 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-200",
                  habit.is_completed_today
                    ? "bg-accent-green border-accent-green text-white shadow-md shadow-accent-green/30"
                    : "border-border bg-transparent text-transparent"
                )}>
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                </div>
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Celebration */}
      <AnimatePresence>
        {isAllDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="p-5 rounded-2xl bg-accent-green/10 border border-accent-green/25 text-center space-y-1"
          >
            <p className="text-2xl">🎉</p>
            <p className="font-semibold text-accent-green">You&apos;re crushing it!</p>
            <p className="text-sm text-text-muted">All {totalCount} habits done for today.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
