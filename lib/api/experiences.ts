import {
  ExperienceTravel,
  ExperienceTravelInsert,
  ExperienceTravelUpdate,
} from '@/types/api'
import { getEntryById, updateEntry } from './entries'

/**
 * Get all experiences/travel items for a specific entry
 */
export async function getExperiencesByEntryId(
  entryId: string
): Promise<ExperienceTravel[]> {
  const entry = await getEntryById(entryId)
  return entry.experiences_travel
}

/**
 * Update experiences/travel items for a specific entry
 * This replaces all items for the entry with the provided array
 */
export async function updateExperiencesForEntry(
  entryId: string,
  experiences: (ExperienceTravelInsert | ExperienceTravelUpdate)[]
): Promise<ExperienceTravel[]> {
  const entry = await updateEntry({
    id: entryId,
    experiences_travel: experiences,
  })
  return entry.experiences_travel
}

/**
 * Add a new experience/travel item to an entry
 */
export async function addExperienceToEntry(
  entryId: string,
  experience: ExperienceTravelInsert
): Promise<ExperienceTravel[]> {
  const entry = await getEntryById(entryId)
  const updatedExperiences = [...entry.experiences_travel, experience]
  return updateExperiencesForEntry(entryId, updatedExperiences)
}

/**
 * Remove an experience/travel item from an entry
 */
export async function removeExperienceFromEntry(
  entryId: string,
  experienceId: string
): Promise<ExperienceTravel[]> {
  const entry = await getEntryById(entryId)
  const updatedExperiences = entry.experiences_travel.filter(
    (e) => e.id !== experienceId
  )
  return updateExperiencesForEntry(entryId, updatedExperiences)
}

