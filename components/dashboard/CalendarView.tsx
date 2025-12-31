'use client'

import { useState, useMemo } from 'react'
import { Calendar } from '@/components/ui'
import type { WeeklyEntryWithItems } from '@/types/api'

interface CalendarViewProps {
  entries: WeeklyEntryWithItems[]
  onDateSelect?: (date: Date) => void
  selectedDate?: Date
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

export function CalendarView({
  entries,
  onDateSelect,
  selectedDate,
  className = '',
}: CalendarViewProps) {
  // Extract all week_start dates from entries
  const highlightedDates = useMemo(() => {
    return entries.map((entry) => {
      const weekStart = new Date(entry.week_start)
      return getMonday(weekStart)
    })
  }, [entries])

  const handleDateSelect = (date: Date) => {
    // Find the entry for the week containing this date
    const weekStart = getMonday(date)
    const weekStartStr = formatDate(weekStart)

    // Find entry with matching week_start
    const entry = entries.find(
      (e) => formatDate(new Date(e.week_start)) === weekStartStr
    )

    if (entry && onDateSelect) {
      onDateSelect(weekStart)
    }
  }

  return (
    <div className={className}>
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        highlightedDates={highlightedDates}
      />
    </div>
  )
}

