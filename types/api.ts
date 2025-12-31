import { Database } from '@/lib/supabase/types'

// Type aliases for easier access
type WeeklyEntry = Database['public']['Tables']['weekly_entries']['Row']
type Habit = Database['public']['Tables']['habits']['Row']
type SideProject = Database['public']['Tables']['side_projects']['Row']
type PurchaseResearch = Database['public']['Tables']['purchases_research']['Row']
type ExperienceTravel = Database['public']['Tables']['experiences_travel']['Row']

// Insert types
type WeeklyEntryInsert = Database['public']['Tables']['weekly_entries']['Insert']
type HabitInsert = Database['public']['Tables']['habits']['Insert']
type SideProjectInsert = Database['public']['Tables']['side_projects']['Insert']
type PurchaseResearchInsert = Database['public']['Tables']['purchases_research']['Insert']
type ExperienceTravelInsert = Database['public']['Tables']['experiences_travel']['Insert']

// Update types
type WeeklyEntryUpdate = Database['public']['Tables']['weekly_entries']['Update']
type HabitUpdate = Database['public']['Tables']['habits']['Update']
type SideProjectUpdate = Database['public']['Tables']['side_projects']['Update']
type PurchaseResearchUpdate = Database['public']['Tables']['purchases_research']['Update']
type ExperienceTravelUpdate = Database['public']['Tables']['experiences_travel']['Update']

// Full entry with all related items
export interface WeeklyEntryWithItems extends WeeklyEntry {
  habits: Habit[]
  side_projects: SideProject[]
  purchases_research: PurchaseResearch[]
  experiences_travel: ExperienceTravel[]
}

// API Request/Response types
export interface CreateEntryRequest {
  week_start: string // ISO date string (YYYY-MM-DD)
}

export interface UpdateEntryRequest {
  week_start?: string
  habits?: (HabitInsert | HabitUpdate)[]
  side_projects?: (SideProjectInsert | SideProjectUpdate)[]
  purchases_research?: (PurchaseResearchInsert | PurchaseResearchUpdate)[]
  experiences_travel?: (ExperienceTravelInsert | ExperienceTravelUpdate)[]
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface EntryListResponse {
  entries: WeeklyEntry[]
}

export interface EntryResponse {
  entry: WeeklyEntryWithItems
}

// Client-side API function types
export type CreateEntryParams = CreateEntryRequest
export type UpdateEntryParams = { id: string } & UpdateEntryRequest

// Export all types for use in components
export type {
  WeeklyEntry,
  Habit,
  SideProject,
  PurchaseResearch,
  ExperienceTravel,
  WeeklyEntryInsert,
  HabitInsert,
  SideProjectInsert,
  PurchaseResearchInsert,
  ExperienceTravelInsert,
  WeeklyEntryUpdate,
  HabitUpdate,
  SideProjectUpdate,
  PurchaseResearchUpdate,
  ExperienceTravelUpdate,
}

