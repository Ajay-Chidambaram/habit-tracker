import { SideProject, SideProjectInsert, SideProjectUpdate } from '@/types/api'
import { getEntryById, updateEntry } from './entries'

/**
 * Get all side projects for a specific entry
 */
export async function getProjectsByEntryId(
  entryId: string
): Promise<SideProject[]> {
  const entry = await getEntryById(entryId)
  return entry.side_projects
}

/**
 * Update side projects for a specific entry
 * This replaces all projects for the entry with the provided array
 */
export async function updateProjectsForEntry(
  entryId: string,
  projects: (SideProjectInsert | SideProjectUpdate)[]
): Promise<SideProject[]> {
  const entry = await updateEntry({
    id: entryId,
    side_projects: projects,
  })
  return entry.side_projects
}

/**
 * Add a new project to an entry
 */
export async function addProjectToEntry(
  entryId: string,
  project: SideProjectInsert
): Promise<SideProject[]> {
  const entry = await getEntryById(entryId)
  const updatedProjects = [...entry.side_projects, project]
  return updateProjectsForEntry(entryId, updatedProjects)
}

/**
 * Remove a project from an entry
 */
export async function removeProjectFromEntry(
  entryId: string,
  projectId: string
): Promise<SideProject[]> {
  const entry = await getEntryById(entryId)
  const updatedProjects = entry.side_projects.filter((p) => p.id !== projectId)
  return updateProjectsForEntry(entryId, updatedProjects)
}

