import {
  ApiResponse,
  EntryListResponse,
  EntryResponse,
  WeeklyEntryWithItems,
  WeeklyEntry,
  CreateEntryParams,
  UpdateEntryParams,
} from '@/types/api'

const API_BASE = '/api/entries'

/**
 * Get all weekly entries for the current user
 */
export async function getAllEntries(): Promise<WeeklyEntry[]> {
  const response = await fetch(API_BASE, {
    credentials: 'include',
  })
  
  if (!response.ok) {
    const error: ApiResponse<null> = await response.json()
    throw new Error(error.error || 'Failed to fetch entries')
  }

  const result: ApiResponse<EntryListResponse> = await response.json()
  return result.data?.entries || []
}

/**
 * Get a specific entry by ID with all related items
 */
export async function getEntryById(id: string): Promise<WeeklyEntryWithItems> {
  const response = await fetch(`${API_BASE}/${id}`, {
    credentials: 'include',
  })
  
  if (!response.ok) {
    const error: ApiResponse<null> = await response.json()
    throw new Error(error.error || 'Failed to fetch entry')
  }

  const result: ApiResponse<EntryResponse> = await response.json()
  if (!result.data?.entry) {
    throw new Error('Entry not found')
  }

  return result.data.entry
}

/**
 * Get or create the current week's entry
 */
export async function getCurrentWeekEntry(): Promise<WeeklyEntryWithItems> {
  const response = await fetch(`${API_BASE}/current-week`, {
    credentials: 'include',
  })
  
  if (!response.ok) {
    const error: ApiResponse<null> = await response.json()
    throw new Error(error.error || 'Failed to fetch current week entry')
  }

  const result: ApiResponse<EntryResponse> = await response.json()
  if (!result.data?.entry) {
    throw new Error('Entry not found')
  }

  return result.data.entry
}

/**
 * Create a new weekly entry
 */
export async function createEntry(
  params: CreateEntryParams
): Promise<WeeklyEntryWithItems> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error: ApiResponse<null> = await response.json()
    throw new Error(error.error || 'Failed to create entry')
  }

  const result: ApiResponse<{ entry: WeeklyEntryWithItems }> =
    await response.json()
  if (!result.data?.entry) {
    throw new Error('Failed to create entry')
  }

  return result.data.entry
}

/**
 * Update a weekly entry and its related items
 */
export async function updateEntry(
  params: UpdateEntryParams
): Promise<WeeklyEntryWithItems> {
  const { id, ...updateData } = params
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(updateData),
  })

  if (!response.ok) {
    const error: ApiResponse<null> = await response.json()
    throw new Error(error.error || 'Failed to update entry')
  }

  const result: ApiResponse<EntryResponse> = await response.json()
  if (!result.data?.entry) {
    throw new Error('Failed to update entry')
  }

  return result.data.entry
}

/**
 * Delete a weekly entry
 */
export async function deleteEntry(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    const error: ApiResponse<null> = await response.json()
    throw new Error(error.error || 'Failed to delete entry')
  }
}

