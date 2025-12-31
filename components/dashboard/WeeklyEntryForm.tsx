'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import { HabitsSection } from './HabitsSection'
import { ProjectsSection } from './ProjectsSection'
import { PurchasesSection } from './PurchasesSection'
import { ExperiencesSection } from './ExperiencesSection'
import type {
  WeeklyEntryWithItems,
  Habit,
  SideProject,
  PurchaseResearch,
  ExperienceTravel,
  HabitInsert,
  SideProjectInsert,
  PurchaseResearchInsert,
  ExperienceTravelInsert,
} from '@/types/api'
import { updateEntry } from '@/lib/api/entries'

interface WeeklyEntryFormProps {
  entry: WeeklyEntryWithItems
  onEntryUpdate?: (entry: WeeklyEntryWithItems) => void
  disabled?: boolean
}

export function WeeklyEntryForm({
  entry,
  onEntryUpdate,
  disabled = false,
}: WeeklyEntryFormProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  )

  // Local state for all items
  const [habits, setHabits] = useState<Habit[]>(entry.habits || [])
  const [projects, setProjects] = useState<SideProject[]>(
    entry.side_projects || []
  )
  const [purchases, setPurchases] = useState<PurchaseResearch[]>(
    entry.purchases_research || []
  )
  const [experiences, setExperiences] = useState<ExperienceTravel[]>(
    entry.experiences_travel || []
  )

  // Update local state when entry prop changes
  useEffect(() => {
    setHabits(entry.habits || [])
    setProjects(entry.side_projects || [])
    setPurchases(entry.purchases_research || [])
    setExperiences(entry.experiences_travel || [])
  }, [entry])

  const handleSave = async () => {
    if (disabled) return

    setIsSaving(true)
    setSaveStatus('idle')

    try {
      // Prepare items with order_index
      const habitsToSave: (HabitInsert | Habit)[] = habits.map((h, idx) => ({
        ...h,
        order_index: idx,
      }))

      const projectsToSave: (SideProjectInsert | SideProject)[] = projects.map(
        (p, idx) => ({
          ...p,
          order_index: idx,
        })
      )

      const purchasesToSave: (
        | PurchaseResearchInsert
        | PurchaseResearch
      )[] = purchases.map((p, idx) => ({
        ...p,
        order_index: idx,
      }))

      const experiencesToSave: (
        | ExperienceTravelInsert
        | ExperienceTravel
      )[] = experiences.map((e, idx) => ({
        ...e,
        order_index: idx,
      }))

      const updatedEntry = await updateEntry({
        id: entry.id,
        habits: habitsToSave,
        side_projects: projectsToSave,
        purchases_research: purchasesToSave,
        experiences_travel: experiencesToSave,
      })

      setSaveStatus('success')
      onEntryUpdate?.(updatedEntry)

      // Clear success message after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('Error saving entry:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges =
    JSON.stringify(habits) !== JSON.stringify(entry.habits || []) ||
    JSON.stringify(projects) !== JSON.stringify(entry.side_projects || []) ||
    JSON.stringify(purchases) !== JSON.stringify(entry.purchases_research || []) ||
    JSON.stringify(experiences) !== JSON.stringify(entry.experiences_travel || [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {saveStatus === 'success' && (
            <p className="text-sm text-green-500">Saved successfully!</p>
          )}
          {saveStatus === 'error' && (
            <p className="text-sm text-red-500">
              Error saving. Please try again.
            </p>
          )}
        </div>
        {!disabled && (
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            loading={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      <HabitsSection
        habits={habits}
        onUpdate={setHabits}
        disabled={disabled}
      />

      <ProjectsSection
        projects={projects}
        onUpdate={setProjects}
        disabled={disabled}
      />

      <PurchasesSection
        purchases={purchases}
        onUpdate={setPurchases}
        disabled={disabled}
      />

      <ExperiencesSection
        experiences={experiences}
        onUpdate={setExperiences}
        disabled={disabled}
      />
    </div>
  )
}

