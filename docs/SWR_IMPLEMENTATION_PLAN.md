# SWR Implementation Plan - Data Fetching Optimization

## Overview

This document provides step-by-step instructions for migrating from custom `useState`/`useEffect` hooks to **SWR** for data fetching. This will eliminate duplicate API calls, add caching, enable stale-while-revalidate, and improve perceived performance.

> [!NOTE]
> **Why SWR over React Query?** SWR is lighter-weight (~4KB vs ~13KB), simpler API, and developed by Vercel - same team as Next.js. Both are excellent choices, but SWR has better Next.js integration out of the box.

---

## Current Architecture

### Hooks to Migrate
| Hook | File | Data Type | Has Mutations |
|------|------|-----------|---------------|
| `useHabits` | `lib/hooks/use-habits.ts` | `HabitWithCompletions[]` | Yes (CRUD + toggle) |
| `useGoals` | `lib/hooks/use-goals.ts` | `GoalWithMilestones[]` | Yes (CRUD) |
| `useLearning` | `lib/hooks/use-learning.ts` | `LearningItemWithSessions[]` | Yes (CRUD) |

### API Layer (Keep As-Is)
- `lib/api/habits.ts` - Fetcher functions
- `lib/api/goals.ts` - Fetcher functions  
- `lib/api/learning.ts` - Fetcher functions

---

## Implementation Steps

### Step 1: Install SWR

```bash
npm install swr
```

---

### Step 2: Create SWR Configuration Provider

Create file: `lib/swr-config.tsx`

```tsx
'use client'

import { SWRConfig } from 'swr'
import { ReactNode } from 'react'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    throw error
  }
  return res.json()
}

interface SWRProviderProps {
  children: ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig 
      value={{
        fetcher,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 2000, // Dedupe requests within 2 seconds
        errorRetryCount: 3,
      }}
    >
      {children}
    </SWRConfig>
  )
}
```

---

### Step 3: Add SWR Provider to Root Layout

Edit file: `app/(dashboard)/layout.tsx`

Wrap the children with `SWRProvider`:

```tsx
import { SWRProvider } from '@/lib/swr-config'

export default function DashboardLayout({ children }) {
  return (
    <SWRProvider>
      {/* existing layout code */}
      {children}
    </SWRProvider>
  )
}
```

---

### Step 4: Migrate `useHabits` Hook

Replace file: `lib/hooks/use-habits.ts`

```tsx
'use client'

import useSWR from 'swr'
import { HabitWithCompletions, CreateHabitInput, UpdateHabitInput } from '@/types'
import { api } from '@/lib/api/habits'
import { useToast } from '@/lib/hooks/use-toast'
import { calculateStreak } from '@/lib/utils/streaks'
import { isSameDay } from 'date-fns'

// Cache key
const HABITS_KEY = '/api/habits'

// Transform function to process raw data
function processHabits(data: HabitWithCompletions[]): HabitWithCompletions[] {
  return data.map(habit => {
    const completions = habit.completions || []
    const streak = calculateStreak(completions)
    const isCompletedToday = completions.some(c =>
      isSameDay(new Date(c.completed_date), new Date())
    )
    return {
      ...habit,
      completions,
      current_streak: streak,
      is_completed_today: isCompletedToday
    }
  })
}

export function useHabits() {
  const { toast } = useToast()
  
  const { data, error, isLoading, mutate } = useSWR<HabitWithCompletions[]>(
    HABITS_KEY,
    async () => {
      const rawData = await api.fetchHabits()
      return processHabits(rawData)
    }
  )

  const habits = data || []

  const addHabit = async (input: CreateHabitInput) => {
    try {
      await api.createHabit(input)
      toast({ title: 'Habit created successfully' })
      mutate() // Revalidate cache
      return true
    } catch (err) {
      toast({ title: 'Error creating habit', variant: 'destructive' })
      return false
    }
  }

  const updateHabit = async (id: string, input: UpdateHabitInput) => {
    try {
      await api.updateHabit(id, input)
      toast({ title: 'Habit updated successfully' })
      mutate()
      return true
    } catch (err) {
      toast({ title: 'Error updating habit', variant: 'destructive' })
      return false
    }
  }

  const deleteHabit = async (id: string) => {
    try {
      // Optimistic update
      mutate(habits.filter(h => h.id !== id), false)
      await api.deleteHabit(id)
      toast({ title: 'Habit deleted' })
      return true
    } catch (err) {
      toast({ title: 'Error deleting habit', variant: 'destructive' })
      mutate() // Revert on error
      return false
    }
  }

  const toggleHabit = async (habitId: string, date: string, isCompleted: boolean) => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return

    // Optimistic update
    const optimisticHabits = habits.map(h => {
      if (h.id !== habitId) return h
      
      const otherCompletions = h.completions.filter(c => c.completed_date !== date)
      const newCompletions = isCompleted
        ? [...otherCompletions, {
            id: 'temp-' + Date.now(),
            habit_id: habitId,
            completed_date: date,
            created_at: new Date().toISOString(),
            duration_minutes: null,
            notes: null
          }]
        : otherCompletions

      return {
        ...h,
        completions: newCompletions,
        current_streak: calculateStreak(newCompletions),
        is_completed_today: newCompletions.some(c =>
          isSameDay(new Date(c.completed_date), new Date())
        )
      }
    })

    mutate(optimisticHabits, false) // Update cache immediately, don't revalidate yet

    try {
      if (isCompleted) {
        await api.completeHabit(habitId, date)
      } else {
        await api.uncompleteHabit(habitId, date)
      }
      mutate() // Revalidate to get server state
    } catch (err) {
      toast({ title: 'Error updating status', variant: 'destructive' })
      mutate() // Revert on error
    }
  }

  return {
    habits,
    loading: isLoading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    refresh: mutate
  }
}
```

---

### Step 5: Migrate `useGoals` Hook

Replace file: `lib/hooks/use-goals.ts`

```tsx
'use client'

import useSWR from 'swr'
import { GoalWithMilestones, CreateGoalInput, UpdateGoalInput, GoalMilestone } from '@/types'
import { api } from '@/lib/api/goals'
import { useToast } from '@/lib/hooks/use-toast'

const GOALS_KEY = '/api/goals'

function calculateProgress(milestones: GoalMilestone[]): number {
  if (!milestones || milestones.length === 0) return 0
  const completed = milestones.filter(m => m.is_completed).length
  return Math.round((completed / milestones.length) * 100)
}

function processGoals(data: GoalWithMilestones[]): GoalWithMilestones[] {
  return data.map(goal => ({
    ...goal,
    milestones: goal.milestones || [],
    progress_percent: calculateProgress(goal.milestones || [])
  }))
}

export function useGoals() {
  const { toast } = useToast()
  
  const { data, error, isLoading, mutate } = useSWR<GoalWithMilestones[]>(
    GOALS_KEY,
    async () => {
      const rawData = await api.fetchGoals()
      return processGoals(rawData)
    }
  )

  const goals = data || []

  const addGoal = async (input: CreateGoalInput) => {
    try {
      await api.createGoal(input)
      toast({ title: 'Goal created successfully' })
      mutate()
      return true
    } catch (err) {
      toast({ title: 'Error creating goal', variant: 'destructive' })
      return false
    }
  }

  const updateGoal = async (id: string, input: UpdateGoalInput) => {
    try {
      await api.updateGoal(id, input)
      toast({ title: 'Goal updated successfully' })
      mutate()
      return true
    } catch (err) {
      toast({ title: 'Error updating goal', variant: 'destructive' })
      return false
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      mutate(goals.filter(g => g.id !== id), false)
      await api.deleteGoal(id)
      toast({ title: 'Goal deleted' })
      return true
    } catch (err) {
      toast({ title: 'Error deleting goal', variant: 'destructive' })
      mutate()
      return false
    }
  }

  return {
    goals,
    loading: isLoading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    refresh: mutate
  }
}
```

---

### Step 6: Migrate `useLearning` Hook

Replace file: `lib/hooks/use-learning.ts`

```tsx
'use client'

import useSWR from 'swr'
import { LearningItemWithSessions, CreateLearningInput, UpdateLearningInput } from '@/types'
import { api } from '@/lib/api/learning'
import { useToast } from '@/lib/hooks/use-toast'

const LEARNING_KEY = '/api/learning'

function processLearningItems(data: LearningItemWithSessions[]): LearningItemWithSessions[] {
  return data.map(item => ({
    ...item,
    sessions: [],
    progress_percent: Math.min(100, Math.round((item.completed_units / item.total_units) * 100))
  }))
}

export function useLearning() {
  const { toast } = useToast()
  
  const { data, error, isLoading, mutate } = useSWR<LearningItemWithSessions[]>(
    LEARNING_KEY,
    async () => {
      const rawData = await api.fetchLearningItems()
      return processLearningItems(rawData)
    }
  )

  const items = data || []

  const addItem = async (input: CreateLearningInput) => {
    try {
      await api.createLearningItem(input)
      toast({ title: 'Learning item created' })
      mutate()
      return true
    } catch (err) {
      toast({ title: 'Error creating item', variant: 'destructive' })
      return false
    }
  }

  const updateItem = async (id: string, input: UpdateLearningInput) => {
    try {
      await api.updateLearningItem(id, input)
      toast({ title: 'Item updated' })
      mutate()
      return true
    } catch (err) {
      toast({ title: 'Error updating item', variant: 'destructive' })
      return false
    }
  }

  const deleteItem = async (id: string) => {
    try {
      mutate(items.filter(i => i.id !== id), false)
      await api.deleteLearningItem(id)
      toast({ title: 'Item deleted' })
      return true
    } catch (err) {
      toast({ title: 'Error deleting item', variant: 'destructive' })
      mutate()
      return false
    }
  }

  return {
    items,
    loading: isLoading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refresh: mutate
  }
}
```

---

### Step 7: Create Single-Item Hooks (Optional Enhancement)

For detail pages, create individual item hooks to enable targeted caching:

Create file: `lib/hooks/use-habit.ts`

```tsx
'use client'

import useSWR from 'swr'
import { HabitWithCompletions } from '@/types'
import { api } from '@/lib/api/habits'
import { calculateStreak } from '@/lib/utils/streaks'
import { isSameDay } from 'date-fns'

export function useHabit(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<HabitWithCompletions>(
    id ? `/api/habits/${id}` : null,
    async () => {
      if (!id) throw new Error('No ID')
      const habit = await api.fetchHabit(id)
      const completions = habit.completions || []
      return {
        ...habit,
        completions,
        current_streak: calculateStreak(completions),
        is_completed_today: completions.some(c =>
          isSameDay(new Date(c.completed_date), new Date())
        )
      }
    }
  )

  return {
    habit: data,
    loading: isLoading,
    error,
    refresh: mutate
  }
}
```

Similarly create `use-goal.ts` and `use-learning-item.ts` for detail pages.

---

## Verification Checklist

After implementing, verify:

- [ ] `npm install swr` completes successfully
- [ ] `npm run build` passes with no errors
- [ ] Dashboard loads and shows data
- [ ] Habits page works (list, create, update, delete, toggle)
- [ ] Goals page works (list, create, update, delete)
- [ ] Learning page works (list, create, update, delete)
- [ ] Check Network tab: only 1 request per data type on dashboard
- [ ] Navigate away and back: data loads instantly from cache
- [ ] Mutations trigger revalidation and UI updates

---

## Benefits After Migration

| Feature | Before | After |
|---------|--------|-------|
| Request deduplication | ❌ Multiple calls | ✅ Single call per key |
| Caching | ❌ None | ✅ In-memory cache |
| Stale-while-revalidate | ❌ | ✅ Shows cached, fetches fresh |
| Background revalidation | ❌ | ✅ On focus, reconnect |
| Optimistic updates | ⚠️ Manual | ✅ Built-in with `mutate()` |
| Error retry | ❌ | ✅ Automatic 3 retries |

---

## Troubleshooting

### Issue: Data not updating after mutation
**Solution**: Ensure you call `mutate()` after the API call succeeds.

### Issue: Stale data showing
**Solution**: Check `dedupingInterval` in SWRConfig. Default is 2000ms.

### Issue: Too many re-renders
**Solution**: Ensure you're using the same cache key string consistently.

### Issue: TypeScript errors
**Solution**: Ensure `useSWR<ReturnType>` generic matches your data type.
