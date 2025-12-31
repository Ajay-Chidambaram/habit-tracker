import { Habit, HabitInsert, HabitUpdate } from '@/types/api'
import { getEntryById, updateEntry } from './entries'

/**
 * Get all habits for a specific entry
 */
export async function getHabitsByEntryId(entryId: string): Promise<Habit[]> {
  const entry = await getEntryById(entryId)
  return entry.habits
}

/**
 * Update habits for a specific entry
 * This replaces all habits for the entry with the provided array
 */
export async function updateHabitsForEntry(
  entryId: string,
  habits: (HabitInsert | HabitUpdate)[]
): Promise<Habit[]> {
  const entry = await updateEntry({
    id: entryId,
    habits,
  })
  return entry.habits
}

/**
 * Add a new habit to an entry
 */
export async function addHabitToEntry(
  entryId: string,
  habit: HabitInsert
): Promise<Habit[]> {
  const entry = await getEntryById(entryId)
  const updatedHabits = [...entry.habits, habit]
  return updateHabitsForEntry(entryId, updatedHabits)
}

/**
 * Remove a habit from an entry
 */
export async function removeHabitFromEntry(
  entryId: string,
  habitId: string
): Promise<Habit[]> {
  const entry = await getEntryById(entryId)
  const updatedHabits = entry.habits.filter((h) => h.id !== habitId)
  return updateHabitsForEntry(entryId, updatedHabits)
}

