// ============================================================================
// DATABASE TYPES
// ============================================================================

export type FrequencyType = 'daily' | 'specific_days' | 'times_per_week'
export type HabitCategory = 'health' | 'productivity' | 'learning' | 'personal' | 'finance' | 'social'
export type GoalStatus = 'active' | 'completed' | 'paused' | 'abandoned'
export type GoalCategory = 'career' | 'health' | 'finance' | 'personal' | 'learning' | 'creative'
export type LearningType = 'skill' | 'book' | 'course' | 'project' | 'certification'
export type LearningStatus = 'not_started' | 'active' | 'paused' | 'completed' | 'dropped'
export type BucketCategory = 'travel' | 'achievement' | 'experience' | 'skill' | 'creative' | 'adventure'
export type BucketPriority = 'someday' | 'this_year' | 'soon' | 'bucket'
export type ProjectStatus = 'idea' | 'planned' | 'active' | 'paused' | 'completed' | 'abandoned'
export type WishlistCategory = 'tech' | 'home' | 'hobby' | 'clothing' | 'travel' | 'general'
export type WishlistStatus = 'researching' | 'decided' | 'purchased' | 'dropped'
export type Theme = 'midnight' | 'forest' | 'sunset' | 'mono'

// ============================================================================
// ENTITY TYPES
// ============================================================================

export interface Habit {
  id: string
  user_id: string
  name: string
  description: string | null
  icon: string
  color: string
  frequency_type: FrequencyType
  frequency_value: number[] | { times: number }
  category: HabitCategory
  target_duration_minutes: number | null
  is_archived: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  completed_date: string
  duration_minutes: number | null
  notes: string | null
  created_at: string
}

export interface HabitWithCompletions extends Habit {
  completions: HabitCompletion[]
  current_streak: number
  is_completed_today: boolean
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description: string | null
  target_date: string | null
  started_at: string
  completed_at: string | null
  status: GoalStatus
  color: string
  icon: string
  category: GoalCategory
  order_index: number
  created_at: string
  updated_at: string
}

export interface GoalMilestone {
  id: string
  goal_id: string
  title: string
  description: string | null
  is_completed: boolean
  completed_at: string | null
  order_index: number
  created_at: string
}

export interface GoalWithMilestones extends Goal {
  milestones: GoalMilestone[]
  progress_percent: number
}

export interface LearningItem {
  id: string
  user_id: string
  title: string
  description: string | null
  type: LearningType
  total_units: number
  completed_units: number
  unit_name: string
  status: LearningStatus
  url: string | null
  resources: Array<{ name: string; url: string; type: string }>
  color: string
  icon: string
  total_time_minutes: number
  started_at: string | null
  completed_at: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface LearningSession {
  id: string
  learning_item_id: string
  session_date: string
  duration_minutes: number
  units_completed: number
  notes: string | null
  created_at: string
}

export interface LearningItemWithSessions extends LearningItem {
  sessions: LearningSession[]
  progress_percent: number
}

export interface BucketListItem {
  id: string
  user_id: string
  title: string
  description: string | null
  category: BucketCategory
  priority: BucketPriority
  is_completed: boolean
  completed_at: string | null
  completion_notes: string | null
  photo_url: string | null
  icon: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  status: ProjectStatus
  goal_id: string | null
  color: string
  icon: string
  url: string | null
  repository_url: string | null
  started_at: string | null
  completed_at: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  name: string
  description: string | null
  category: WishlistCategory
  priority: number
  status: WishlistStatus
  price: number | null
  url: string | null
  notes: string | null
  purchased_at: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  user_id: string
  theme: Theme
  week_starts_on: number
  dashboard_layout: Record<string, unknown>
  notifications_enabled: boolean
  reminder_time: string
  updated_at: string
}

// ============================================================================
// API TYPES
// ============================================================================

export interface CreateHabitInput {
  name: string
  description?: string
  icon?: string
  color?: string
  frequency_type?: FrequencyType
  frequency_value?: number[] | { times: number }
  category?: HabitCategory
  target_duration_minutes?: number
}

export interface UpdateHabitInput extends Partial<CreateHabitInput> {
  is_archived?: boolean
  order_index?: number
}

export interface CreateGoalInput {
  title: string
  description?: string
  target_date?: string
  color?: string
  icon?: string
  category?: GoalCategory
}

export interface UpdateGoalInput extends Partial<CreateGoalInput> {
  status?: GoalStatus
  completed_at?: string
}

export interface CreateMilestoneInput {
  title: string
  description?: string
}

export interface CreateLearningInput {
  title: string
  description?: string
  type?: LearningType
  total_units?: number
  unit_name?: string
  url?: string
  color?: string
  icon?: string
}

export interface UpdateLearningInput extends Partial<CreateLearningInput> {
  completed_units?: number
  status?: LearningStatus
  total_time_minutes?: number
}

export interface CreateSessionInput {
  duration_minutes: number
  units_completed?: number
  notes?: string
  session_date?: string
}

export interface CreateBucketItemInput {
  title: string
  description?: string
  category?: BucketCategory
  priority?: BucketPriority
  icon?: string
}

export interface UpdateBucketItemInput extends Partial<CreateBucketItemInput> {
  is_completed?: boolean
  completion_notes?: string
  photo_url?: string
}

export interface CreateProjectInput {
  name: string
  description?: string
  goal_id?: string
  color?: string
  icon?: string
  url?: string
  repository_url?: string
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  status?: ProjectStatus
}

export interface CreateWishlistInput {
  name: string
  description?: string
  category?: WishlistCategory
  priority?: number
  price?: number
  url?: string
  notes?: string
}

export interface UpdateWishlistInput extends Partial<CreateWishlistInput> {
  status?: WishlistStatus
}
