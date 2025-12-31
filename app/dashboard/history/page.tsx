'use client'

import { useEffect, useState } from 'react'
import { CalendarView } from '@/components/dashboard/CalendarView'
import { WeeklyEntryForm } from '@/components/dashboard/WeeklyEntryForm'
import { Card, CardHeader, CardBody } from '@/components/ui'
import { Skeleton } from '@/components/ui'
import { getAllEntries, getEntryById } from '@/lib/api/entries'
import type { WeeklyEntryWithItems, WeeklyEntry } from '@/types/api'

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

export default function HistoryPage() {
  const [entries, setEntries] = useState<WeeklyEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<WeeklyEntryWithItems | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    setLoading(true)
    setError(null)

    try {
      const allEntries = await getAllEntries()
      // Sort by week_start descending (most recent first)
      const sortedEntries = allEntries.sort((a, b) => {
        const dateA = new Date(a.week_start).getTime()
        const dateB = new Date(b.week_start).getTime()
        return dateB - dateA
      })
      setEntries(sortedEntries)
    } catch (err) {
      console.error('Error loading entries:', err)
      setError(err instanceof Error ? err.message : 'Failed to load entries')
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = async (date: Date) => {
    const weekStartStr = formatDate(date)
    setSelectedDate(date)

    // Find entry with matching week_start
    const entry = entries.find(
      (e) => formatDate(new Date(e.week_start)) === weekStartStr
    )

    if (entry) {
      // Load full entry details
      try {
        const fullEntry = await getEntryById(entry.id)
        setSelectedEntry(fullEntry)
      } catch (err) {
        console.error('Error loading entry:', err)
        setSelectedEntry(null)
      }
    } else {
      setSelectedEntry(null)
    }
  }

  const handleEntryClick = async (entry: WeeklyEntry) => {
    const weekStart = new Date(entry.week_start)
    setSelectedDate(weekStart)

    try {
      const fullEntry = await getEntryById(entry.id)
      setSelectedEntry(fullEntry)
    } catch (err) {
      console.error('Error loading entry:', err)
      setSelectedEntry(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={loadEntries}
          className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">
          History
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CalendarView
            entries={entries}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />

          {entries.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Recent Weeks
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {entries.map((entry) => {
                    const weekStart = new Date(entry.week_start)
                    const isSelected =
                      selectedEntry?.id === entry.id ||
                      (selectedDate &&
                        formatDate(weekStart) === formatDate(selectedDate))

                    return (
                      <button
                        key={entry.id}
                        onClick={() => handleEntryClick(entry)}
                        className={`
                          w-full text-left p-3 rounded-lg transition-colors
                          ${
                            isSelected
                              ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                              : 'bg-[var(--background)] hover:bg-[var(--accent)] text-[var(--foreground)]'
                          }
                        `}
                      >
                        <div className="font-medium">
                          {formatWeekRange(weekStart)}
                        </div>
                        <div className="text-xs mt-1 opacity-80">
                          Week of {formatDate(weekStart)}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedEntry ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  {formatWeekRange(new Date(selectedEntry.week_start))}
                </h2>
              </div>
              <WeeklyEntryForm entry={selectedEntry} disabled={true} />
            </div>
          ) : (
            <Card>
              <CardBody>
                <div className="text-center py-12">
                  <p className="text-[var(--muted-foreground)]">
                    Select a week from the calendar or list to view its details.
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

