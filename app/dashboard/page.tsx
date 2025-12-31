'use client'

import { useEffect, useState } from 'react'
import { WeekSelector } from '@/components/dashboard/WeekSelector'
import { WeeklyEntryForm } from '@/components/dashboard/WeeklyEntryForm'
import { Skeleton } from '@/components/ui'
import { useAuth } from '@/components/auth/AuthProvider'
import { getCurrentWeekEntry, getAllEntries, getEntryById, createEntry } from '@/lib/api/entries'
import type { WeeklyEntryWithItems } from '@/types/api'

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

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [entry, setEntry] = useState<WeeklyEntryWithItems | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(
    getMonday(new Date())
  )

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login'
    }
  }, [user, authLoading])

  const loadEntry = async (weekStart: Date) => {
    setLoading(true)
    setError(null)

    try {
      const weekStartStr = formatDate(weekStart)
      const currentWeekStart = formatDate(getMonday(new Date()))

      // If it's the current week, use getCurrentWeekEntry (which creates if needed)
      if (weekStartStr === currentWeekStart) {
        const currentEntry = await getCurrentWeekEntry()
        setEntry(currentEntry)
        // Only update selectedWeekStart if it's different to avoid infinite loops
        const entryWeekStart = formatDate(new Date(currentEntry.week_start))
        if (entryWeekStart !== weekStartStr) {
          setSelectedWeekStart(new Date(currentEntry.week_start))
        }
      } else {
        // For past weeks, fetch all entries and find the matching one
        const allEntries = await getAllEntries()
        const matchingEntry = allEntries.find(
          (e) => formatDate(new Date(e.week_start)) === weekStartStr
        )

        if (matchingEntry) {
          // Load full entry with all items
          const fullEntry = await getEntryById(matchingEntry.id)
          setEntry(fullEntry)
          // Only update if different to avoid loops
          const entryWeekStart = formatDate(new Date(fullEntry.week_start))
          if (entryWeekStart !== weekStartStr) {
            setSelectedWeekStart(new Date(fullEntry.week_start))
          }
        } else {
          // Entry doesn't exist for this week - create it
          try {
            const newEntry = await createEntry({ week_start: weekStartStr })
            const fullEntry = await getEntryById(newEntry.id)
            setEntry(fullEntry)
            // Only update if different to avoid loops
            const entryWeekStart = formatDate(new Date(fullEntry.week_start))
            if (entryWeekStart !== weekStartStr) {
              setSelectedWeekStart(new Date(fullEntry.week_start))
            }
          } catch (createErr) {
            // If creation fails (e.g., entry already exists), try fetching again
            const allEntriesRetry = await getAllEntries()
            const retryEntry = allEntriesRetry.find(
              (e) => formatDate(new Date(e.week_start)) === weekStartStr
            )
            if (retryEntry) {
              const fullEntry = await getEntryById(retryEntry.id)
              setEntry(fullEntry)
              // Only update if different to avoid loops
              const entryWeekStart = formatDate(new Date(fullEntry.week_start))
              if (entryWeekStart !== weekStartStr) {
                setSelectedWeekStart(new Date(fullEntry.week_start))
              }
            } else {
              setEntry(null)
            }
          }
        }
      }
    } catch (err) {
      console.error('Error loading entry:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load entry'
      setError(errorMessage)
      
      // If unauthorized, redirect to login
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        window.location.href = '/login'
        return
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Don't load if auth is still loading or user is not authenticated
    if (authLoading || !user) {
      return
    }

    // Use a ref to prevent multiple simultaneous calls
    let cancelled = false
    
    const load = async () => {
      if (!cancelled) {
        await loadEntry(selectedWeekStart)
      }
    }
    
    load()
    
    return () => {
      cancelled = true
    }
  }, [selectedWeekStart, authLoading, user])

  const handleWeekChange = (weekStart: Date) => {
    setSelectedWeekStart(weekStart)
  }

  const handleEntryUpdate = (updatedEntry: WeeklyEntryWithItems) => {
    setEntry(updatedEntry)
  }

  // Show loading while checking auth or loading data
  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  // Don't render if not authenticated (redirect will happen)
  if (!user) {
    return null
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={() => loadEntry(selectedWeekStart)}
          className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="space-y-6">
        <WeekSelector
          selectedWeekStart={selectedWeekStart}
          onWeekChange={handleWeekChange}
        />
        <div className="text-center py-12">
          <p className="text-[var(--muted-foreground)]">
            No entry found for this week. Create one by navigating to the current
            week.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <WeekSelector
        selectedWeekStart={selectedWeekStart}
        onWeekChange={handleWeekChange}
      />
      <WeeklyEntryForm entry={entry} onEntryUpdate={handleEntryUpdate} />
    </div>
  )
}

