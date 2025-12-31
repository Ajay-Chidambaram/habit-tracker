'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui'

interface WeekSelectorProps {
  selectedWeekStart: Date
  onWeekChange: (weekStart: Date) => void
  className?: string
}

/**
 * Get the Monday of the week for a given date
 */
function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  return new Date(d.setDate(diff))
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Format date range for display (e.g., "Jan 1 - Jan 7, 2024")
 */
function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  }

  const yearOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
  }

  const startStr = weekStart.toLocaleDateString('en-US', options)
  const endStr = weekEnd.toLocaleDateString('en-US', options)
  const year = weekStart.toLocaleDateString('en-US', yearOptions)

  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${startStr} - ${weekEnd.getDate()}, ${year}`
  }
  return `${startStr} - ${endStr}, ${year}`
}

export function WeekSelector({
  selectedWeekStart,
  onWeekChange,
  className = '',
}: WeekSelectorProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    getMonday(selectedWeekStart)
  )

  useEffect(() => {
    setCurrentWeekStart(getMonday(selectedWeekStart))
  }, [selectedWeekStart])

  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeekStart)
    prevWeek.setDate(prevWeek.getDate() - 7)
    setCurrentWeekStart(prevWeek)
    onWeekChange(prevWeek)
  }

  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeekStart)
    nextWeek.setDate(nextWeek.getDate() + 7)
    setCurrentWeekStart(nextWeek)
    onWeekChange(nextWeek)
  }

  const goToCurrentWeek = () => {
    const today = getMonday(new Date())
    setCurrentWeekStart(today)
    onWeekChange(today)
  }

  const isCurrentWeek =
    formatDate(currentWeekStart) === formatDate(getMonday(new Date()))

  return (
    <div
      className={`flex items-center justify-between gap-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg ${className}`}
    >
      <Button
        onClick={goToPreviousWeek}
        variant="ghost"
        size="sm"
        className="flex-shrink-0"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Previous
      </Button>

      <div className="flex-1 text-center">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          {formatWeekRange(currentWeekStart)}
        </h2>
        {isCurrentWeek && (
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Current Week
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isCurrentWeek && (
          <Button
            onClick={goToCurrentWeek}
            variant="ghost"
            size="sm"
            className="flex-shrink-0"
          >
            Today
          </Button>
        )}
        <Button
          onClick={goToNextWeek}
          variant="ghost"
          size="sm"
          className="flex-shrink-0"
        >
          Next
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </div>
    </div>
  )
}

