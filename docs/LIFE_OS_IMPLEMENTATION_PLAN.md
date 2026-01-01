# Life OS - Complete Implementation Plan

## 📢 Agent Instructions

> **Before starting:** Read the "Existing Infrastructure" section below!
> 
> **While working:** Update your progress in `docs/AGENT_STATUS.md`
> 
> **When complete:** Mark your task as ✅ Complete in the status file

---

## Overview

Transform the existing weekly habit tracker into a comprehensive "Life OS" personal dashboard with:
- Daily habit tracking with streaks
- Long-term goal management
- Learning progress tracking
- Bucket list
- Projects & Wishlist

**Tech Stack:** Next.js 14, Supabase, Tailwind CSS, PWA
**Design:** Desktop-first, responsive, "Midnight Focus" theme

---

## ⚠️ IMPORTANT: Existing Infrastructure (DO NOT RECREATE)

The codebase has been cleaned up. The following files already exist and are **working**. Agents should **USE these, not recreate them**:

### Kept Files (Read-Only Reference)

```
habit-tracker/
├── app/
│   ├── auth/callback/route.ts    # ✅ Working OAuth callback
│   ├── login/page.tsx            # ✅ Working login page
│   ├── layout.tsx                # ✅ Root layout (needs PWA meta added)
│   ├── globals.css               # ⚡ Exists, will be REPLACED by Task 2
│   └── page.tsx                  # ⚡ Exists, will be REPLACED (landing page)
├── components/
│   └── auth/
│       ├── AuthProvider.tsx      # ✅ Working auth context
│       ├── LoginButton.tsx       # ✅ Working Google login button
│       └── LogoutButton.tsx      # ✅ Working logout button
├── lib/
│   └── supabase/
│       ├── client.ts             # ✅ Browser Supabase client
│       └── server.ts             # ✅ Server Supabase client
├── middleware.ts                 # ✅ Auth middleware (protects /dashboard/*)
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # 📝 Old schema (reference only)
├── tailwind.config.ts            # ⚡ Exists, will be EXTENDED by Task 2
├── next.config.js                # ✅ Keep as-is
├── package.json                  # ✅ Dependencies installed
└── tsconfig.json                 # ✅ TypeScript config
```

### How Agents Should Use Existing Files

| File | Agent Action |
|------|--------------|
| `lib/supabase/client.ts` | **IMPORT and USE** - Don't recreate |
| `lib/supabase/server.ts` | **IMPORT and USE** - Don't recreate |
| `components/auth/*` | **IMPORT and USE** - Don't recreate |
| `middleware.ts` | **KEEP** - Already protects `/dashboard/*` routes |
| `app/layout.tsx` | **MODIFY** - Add PWA meta tags (Task 10) |
| `app/globals.css` | **REPLACE** - New theme (Task 2) |
| `tailwind.config.ts` | **EXTEND** - Add new theme config (Task 2) |

### Key Imports for New Code

```typescript
// In any server component or API route:
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

// In any client component:
import { useAuth } from '@/components/auth/AuthProvider'
const { user, loading, signOut } = useAuth()

// Or direct client:
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

### Environment Variables (Already Configured)

The following env vars are already set in `.env.local` and Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**DO NOT** ask user to reconfigure these.

---

## Project Structure (Final)

```
habit-tracker/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── auth/callback/route.ts
│   ├── (dashboard)/
│   │   ├── layout.tsx                 # Main app layout with nav
│   │   ├── page.tsx                   # Dashboard home (today view)
│   │   ├── habits/
│   │   │   ├── page.tsx               # All habits + heatmap
│   │   │   └── [id]/page.tsx          # Single habit detail
│   │   ├── goals/
│   │   │   ├── page.tsx               # All goals
│   │   │   └── [id]/page.tsx          # Goal detail + milestones
│   │   ├── learning/
│   │   │   ├── page.tsx               # Learning items
│   │   │   └── [id]/page.tsx          # Item detail + sessions
│   │   ├── bucket-list/page.tsx       # Bucket list
│   │   ├── projects/page.tsx          # Projects kanban
│   │   ├── wishlist/page.tsx          # Wishlist
│   │   ├── insights/page.tsx          # Analytics & charts
│   │   └── settings/page.tsx          # User preferences
│   ├── api/
│   │   ├── habits/
│   │   │   ├── route.ts               # GET all, POST new
│   │   │   └── [id]/
│   │   │       ├── route.ts           # GET, PUT, DELETE
│   │   │       └── complete/route.ts  # POST completion
│   │   ├── goals/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── milestones/route.ts
│   │   ├── learning/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── sessions/route.ts
│   │   ├── bucket-list/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── projects/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── wishlist/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── manifest.ts                    # PWA manifest
│   └── page.tsx                       # Landing/redirect
├── components/
│   ├── ui/                            # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── progress-ring.tsx
│   │   ├── progress-bar.tsx
│   │   ├── badge.tsx
│   │   ├── dropdown.tsx
│   │   ├── toast.tsx
│   │   ├── skeleton.tsx
│   │   ├── tabs.tsx
│   │   ├── calendar.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── mobile-nav.tsx
│   │   └── page-header.tsx
│   ├── habits/
│   │   ├── habit-card.tsx             # Single habit with tap-to-complete
│   │   ├── habit-list.tsx             # Today's habits
│   │   ├── habit-form.tsx             # Create/edit habit
│   │   ├── habit-heatmap.tsx          # GitHub-style grid
│   │   ├── streak-badge.tsx           # Fire emoji + count
│   │   └── habit-stats.tsx            # Completion stats
│   ├── goals/
│   │   ├── goal-card.tsx
│   │   ├── goal-list.tsx
│   │   ├── goal-form.tsx
│   │   ├── milestone-list.tsx
│   │   ├── milestone-item.tsx
│   │   └── goal-progress-ring.tsx
│   ├── learning/
│   │   ├── learning-card.tsx
│   │   ├── learning-list.tsx
│   │   ├── learning-form.tsx
│   │   ├── session-log.tsx
│   │   └── progress-chart.tsx
│   ├── bucket-list/
│   │   ├── bucket-item.tsx
│   │   ├── bucket-list-grid.tsx
│   │   └── bucket-form.tsx
│   ├── projects/
│   │   ├── project-card.tsx
│   │   ├── project-board.tsx
│   │   └── project-form.tsx
│   ├── wishlist/
│   │   ├── wishlist-item.tsx
│   │   ├── wishlist-grid.tsx
│   │   └── wishlist-form.tsx
│   ├── dashboard/
│   │   ├── today-habits.tsx
│   │   ├── active-goals.tsx
│   │   ├── learning-summary.tsx
│   │   ├── streak-summary.tsx
│   │   └── weekly-progress.tsx
│   └── insights/
│       ├── habit-analytics.tsx
│       ├── goal-timeline.tsx
│       └── monthly-summary.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts                   # Generated types
│   ├── api/                           # Client-side fetchers
│   │   ├── habits.ts
│   │   ├── goals.ts
│   │   ├── learning.ts
│   │   ├── bucket-list.ts
│   │   ├── projects.ts
│   │   └── wishlist.ts
│   ├── hooks/
│   │   ├── use-habits.ts
│   │   ├── use-goals.ts
│   │   ├── use-learning.ts
│   │   └── use-toast.ts
│   └── utils/
│       ├── dates.ts                   # Date helpers
│       ├── streaks.ts                 # Streak calculations
│       └── colors.ts                  # Theme colors
├── types/
│   └── index.ts                       # All TypeScript types
├── public/
│   ├── icons/                         # PWA icons
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── apple-touch-icon.png
│   └── sw.js                          # Service worker
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql     # (existing)
│       └── 002_life_os_schema.sql     # New schema
└── docs/
    └── LIFE_OS_IMPLEMENTATION_PLAN.md
```

---

## Task Breakdown

### ═══════════════════════════════════════════════════════════════════
### TASK 1: Database Schema
### ═══════════════════════════════════════════════════════════════════

**Assignee:** Agent 1
**Dependencies:** None
**Estimated Time:** 30 minutes

#### Files to Create/Modify

1. `supabase/migrations/002_life_os_schema.sql`
2. `types/index.ts`

#### Full Schema SQL

```sql
-- ============================================================================
-- LIFE OS SCHEMA - Migration 002
-- ============================================================================

-- ============================================================================
-- 1. HABITS (Persistent, not weekly)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT '✓',
    color TEXT DEFAULT '#4ade80',
    
    -- Frequency settings
    frequency_type TEXT NOT NULL DEFAULT 'daily' 
        CHECK (frequency_type IN ('daily', 'specific_days', 'times_per_week')),
    frequency_value JSONB DEFAULT '[]', -- [1,2,3,4,5] for specific days, or {"times": 3} for times_per_week
    
    -- Categorization
    category TEXT DEFAULT 'personal'
        CHECK (category IN ('health', 'productivity', 'learning', 'personal', 'finance', 'social')),
    
    -- Optional time tracking
    target_duration_minutes INTEGER, -- NULL means no time tracking
    
    -- State
    is_archived BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for habits
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own habits"
    ON public.habits FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_habits_user_id ON public.habits(user_id);
CREATE INDEX idx_habits_archived ON public.habits(user_id, is_archived);

-- ============================================================================
-- 2. HABIT COMPLETIONS (Daily log)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.habit_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    completed_date DATE NOT NULL,
    duration_minutes INTEGER, -- For timed habits
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(habit_id, completed_date)
);

-- RLS for habit_completions
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage completions for their habits"
    ON public.habit_completions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.habits
            WHERE habits.id = habit_completions.habit_id
            AND habits.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.habits
            WHERE habits.id = habit_completions.habit_id
            AND habits.user_id = auth.uid()
        )
    );

CREATE INDEX idx_completions_habit_date ON public.habit_completions(habit_id, completed_date);
CREATE INDEX idx_completions_date ON public.habit_completions(completed_date);

-- ============================================================================
-- 3. GOALS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    
    -- Timeline
    target_date DATE,
    started_at DATE DEFAULT CURRENT_DATE,
    completed_at DATE,
    
    -- Status
    status TEXT DEFAULT 'active'
        CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
    
    -- Visual
    color TEXT DEFAULT '#3b82f6',
    icon TEXT DEFAULT '🎯',
    category TEXT DEFAULT 'personal'
        CHECK (category IN ('career', 'health', 'finance', 'personal', 'learning', 'creative')),
    
    -- Order
    order_index INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for goals
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own goals"
    ON public.goals FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_goals_user_status ON public.goals(user_id, status);

-- ============================================================================
-- 4. GOAL MILESTONES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.goal_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for goal_milestones
ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage milestones for their goals"
    ON public.goal_milestones FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.goals
            WHERE goals.id = goal_milestones.goal_id
            AND goals.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.goals
            WHERE goals.id = goal_milestones.goal_id
            AND goals.user_id = auth.uid()
        )
    );

CREATE INDEX idx_milestones_goal ON public.goal_milestones(goal_id);

-- ============================================================================
-- 5. LEARNING ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.learning_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    
    -- Type
    type TEXT DEFAULT 'skill'
        CHECK (type IN ('skill', 'book', 'course', 'project', 'certification')),
    
    -- Progress tracking
    total_units INTEGER DEFAULT 100, -- chapters, modules, percentage
    completed_units INTEGER DEFAULT 0,
    unit_name TEXT DEFAULT 'percent', -- 'chapters', 'modules', 'lessons', 'percent'
    
    -- Status
    status TEXT DEFAULT 'active'
        CHECK (status IN ('not_started', 'active', 'paused', 'completed', 'dropped')),
    
    -- Links and resources
    url TEXT,
    resources JSONB DEFAULT '[]', -- [{name, url, type}]
    
    -- Visual
    color TEXT DEFAULT '#8b5cf6',
    icon TEXT DEFAULT '📚',
    
    -- Time tracking
    total_time_minutes INTEGER DEFAULT 0,
    
    started_at DATE,
    completed_at DATE,
    
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for learning_items
ALTER TABLE public.learning_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own learning items"
    ON public.learning_items FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_learning_user_status ON public.learning_items(user_id, status);

-- ============================================================================
-- 6. LEARNING SESSIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_item_id UUID NOT NULL REFERENCES public.learning_items(id) ON DELETE CASCADE,
    
    session_date DATE DEFAULT CURRENT_DATE,
    duration_minutes INTEGER NOT NULL DEFAULT 0,
    units_completed INTEGER DEFAULT 0,
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for learning_sessions
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage sessions for their learning items"
    ON public.learning_sessions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.learning_items
            WHERE learning_items.id = learning_sessions.learning_item_id
            AND learning_items.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.learning_items
            WHERE learning_items.id = learning_sessions.learning_item_id
            AND learning_items.user_id = auth.uid()
        )
    );

CREATE INDEX idx_sessions_item ON public.learning_sessions(learning_item_id);
CREATE INDEX idx_sessions_date ON public.learning_sessions(session_date);

-- ============================================================================
-- 7. BUCKET LIST ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bucket_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    
    -- Categorization
    category TEXT DEFAULT 'experience'
        CHECK (category IN ('travel', 'achievement', 'experience', 'skill', 'creative', 'adventure')),
    
    -- Priority
    priority TEXT DEFAULT 'someday'
        CHECK (priority IN ('someday', 'this_year', 'soon', 'bucket')),
    
    -- Completion
    is_completed BOOLEAN DEFAULT false,
    completed_at DATE,
    completion_notes TEXT,
    photo_url TEXT,
    
    -- Visual
    icon TEXT DEFAULT '✨',
    
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for bucket_list_items
ALTER TABLE public.bucket_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own bucket list"
    ON public.bucket_list_items FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_bucket_user ON public.bucket_list_items(user_id);
CREATE INDEX idx_bucket_completed ON public.bucket_list_items(user_id, is_completed);

-- ============================================================================
-- 8. PROJECTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    
    -- Status (Kanban)
    status TEXT DEFAULT 'idea'
        CHECK (status IN ('idea', 'planned', 'active', 'paused', 'completed', 'abandoned')),
    
    -- Link to goal (optional)
    goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    
    -- Visual
    color TEXT DEFAULT '#f59e0b',
    icon TEXT DEFAULT '💼',
    
    -- Links
    url TEXT,
    repository_url TEXT,
    
    started_at DATE,
    completed_at DATE,
    
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own projects"
    ON public.projects FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_projects_user_status ON public.projects(user_id, status);

-- ============================================================================
-- 9. WISHLIST ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    
    -- Category
    category TEXT DEFAULT 'general'
        CHECK (category IN ('tech', 'home', 'hobby', 'clothing', 'travel', 'general')),
    
    -- Priority (1-3 stars)
    priority INTEGER DEFAULT 2 CHECK (priority >= 1 AND priority <= 3),
    
    -- Status
    status TEXT DEFAULT 'researching'
        CHECK (status IN ('researching', 'decided', 'purchased', 'dropped')),
    
    -- Details
    price DECIMAL(10, 2),
    url TEXT,
    notes TEXT,
    
    purchased_at DATE,
    
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for wishlist_items
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wishlist"
    ON public.wishlist_items FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_wishlist_user_status ON public.wishlist_items(user_id, status);

-- ============================================================================
-- 10. USER PREFERENCES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Theme
    theme TEXT DEFAULT 'midnight'
        CHECK (theme IN ('midnight', 'forest', 'sunset', 'mono')),
    
    -- Week start
    week_starts_on INTEGER DEFAULT 1, -- 0=Sunday, 1=Monday
    
    -- Dashboard layout preferences
    dashboard_layout JSONB DEFAULT '{}',
    
    -- Notification preferences
    notifications_enabled BOOLEAN DEFAULT false,
    reminder_time TIME DEFAULT '09:00',
    
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences"
    ON public.user_preferences FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Trigger to auto-create preferences when profile is created
CREATE OR REPLACE FUNCTION public.handle_new_profile_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_preferences
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_preferences();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate streak for a habit
CREATE OR REPLACE FUNCTION public.get_habit_streak(habit_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    streak INTEGER := 0;
    check_date DATE := CURRENT_DATE;
    completion_exists BOOLEAN;
BEGIN
    LOOP
        SELECT EXISTS(
            SELECT 1 FROM public.habit_completions
            WHERE habit_id = habit_uuid AND completed_date = check_date
        ) INTO completion_exists;
        
        IF completion_exists THEN
            streak := streak + 1;
            check_date := check_date - 1;
        ELSE
            -- Allow one day gap (if checking yesterday)
            IF check_date = CURRENT_DATE THEN
                check_date := check_date - 1;
            ELSE
                EXIT;
            END IF;
        END IF;
        
        -- Safety limit
        IF streak > 1000 THEN EXIT; END IF;
    END LOOP;
    
    RETURN streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update timestamp trigger for all tables
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to relevant tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.habits
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.goals
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.learning_items
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.bucket_list_items
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.wishlist_items
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();
```

#### TypeScript Types (types/index.ts)

```typescript
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
```

#### Completion Criteria
- [ ] Migration file created and tested locally
- [ ] Types file complete with all entities and API types
- [ ] Migration applied to Supabase (run via MCP or dashboard)
- [ ] RLS policies verified


---

### ═══════════════════════════════════════════════════════════════════
### TASK 2: Design System & UI Components
### ═══════════════════════════════════════════════════════════════════

**Assignee:** Agent 2
**Dependencies:** None (can start immediately)
**Estimated Time:** 1-2 hours

#### Files to Create/Modify

1. `app/globals.css` - Theme variables and base styles
2. `tailwind.config.ts` - Extended theme configuration
3. `components/ui/button.tsx`
4. `components/ui/card.tsx`
5. `components/ui/input.tsx`
6. `components/ui/modal.tsx`
7. `components/ui/progress-ring.tsx`
8. `components/ui/progress-bar.tsx`
9. `components/ui/badge.tsx`
10. `components/ui/dropdown.tsx`
11. `components/ui/tabs.tsx`
12. `components/ui/skeleton.tsx`
13. `components/ui/toast.tsx`
14. `components/ui/index.ts`
15. `lib/utils/colors.ts`

#### Design Specifications

**Theme: "Midnight Focus"**

```css
/* globals.css */
:root {
  /* Background layers */
  --bg-base: #0a0f14;
  --bg-surface: #0f1419;
  --bg-elevated: #151c24;
  --bg-overlay: #1a232d;
  
  /* Text */
  --text-primary: #f0f4f8;
  --text-secondary: #8899a6;
  --text-muted: #5b6c7a;
  
  /* Borders */
  --border-default: #1e2a36;
  --border-hover: #2a3a48;
  
  /* Accent colors */
  --accent-green: #4ade80;
  --accent-blue: #22d3ee;
  --accent-purple: #a78bfa;
  --accent-amber: #fbbf24;
  --accent-rose: #fb7185;
  --accent-orange: #fb923c;
  
  /* Status */
  --success: #4ade80;
  --warning: #fbbf24;
  --error: #f87171;
  --info: #22d3ee;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  --shadow-glow-green: 0 0 20px rgba(74, 222, 128, 0.15);
  --shadow-glow-blue: 0 0 20px rgba(34, 211, 238, 0.15);
  
  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
}

/* Font */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

body {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-base);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}
```

**Component Specifications:**

```typescript
// Button variants
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

// Primary: Solid accent color
// Secondary: Border + transparent bg
// Ghost: Text only, hover bg
// Danger: Red for destructive actions

// Card variants
type CardVariant = 'default' | 'interactive' | 'highlighted'
// Default: Surface background
// Interactive: Hover effects, cursor pointer
// Highlighted: Glow border effect

// Progress Ring
// Circular SVG progress with stroke-dasharray
// Size: sm (40px), md (60px), lg (80px)
// Shows percentage in center

// Badge
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'
// Pill shape, small text, colored background
```

#### Completion Criteria
- [ ] All UI components created with TypeScript
- [ ] Dark theme implemented with CSS variables
- [ ] Components are accessible (keyboard, ARIA)
- [ ] Responsive sizing
- [ ] Smooth transitions/animations
- [ ] Storybook-ready props (variant, size, disabled, etc.)


---

### ═══════════════════════════════════════════════════════════════════
### TASK 3: Layout & Navigation
### ═══════════════════════════════════════════════════════════════════

**Assignee:** Agent 3
**Dependencies:** Task 2 (UI components)
**Estimated Time:** 1 hour

#### Files to Create/Modify

1. `app/(dashboard)/layout.tsx` - Main dashboard layout
2. `components/layout/sidebar.tsx` - Desktop sidebar navigation
3. `components/layout/header.tsx` - Top header with user menu
4. `components/layout/mobile-nav.tsx` - Bottom navigation for mobile
5. `components/layout/page-header.tsx` - Reusable page title component

#### Specifications

**Desktop Layout (>= 1024px):**
```
┌──────────────────────────────────────────────────────────────┐
│  Header (60px)                                    User Menu  │
├──────────┬───────────────────────────────────────────────────┤
│          │                                                   │
│ Sidebar  │  Main Content Area                                │
│ (240px)  │  (padding: 32px)                                  │
│          │                                                   │
│          │                                                   │
│          │                                                   │
│          │                                                   │
│          │                                                   │
└──────────┴───────────────────────────────────────────────────┘
```

**Mobile Layout (< 1024px):**
```
┌─────────────────────────┐
│ Header (56px)           │
├─────────────────────────┤
│                         │
│ Main Content            │
│ (padding: 16px)         │
│                         │
│                         │
│                         │
├─────────────────────────┤
│ Bottom Nav (64px)       │
│ 🏠  📊  🎯  📚  ⋯      │
└─────────────────────────┘
```

**Sidebar Navigation Items:**
```typescript
const navItems = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Habits', href: '/habits', icon: RefreshIcon },
  { name: 'Goals', href: '/goals', icon: TargetIcon },
  { name: 'Learning', href: '/learning', icon: BookIcon },
  { name: 'Bucket List', href: '/bucket-list', icon: StarIcon },
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Wishlist', href: '/wishlist', icon: ShoppingCartIcon },
  // Divider
  { name: 'Insights', href: '/insights', icon: ChartIcon },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
]
```

**Mobile Bottom Nav (5 items max):**
- Dashboard (home)
- Habits
- Goals
- Learning
- More (opens sheet with rest)

#### Completion Criteria
- [ ] Desktop sidebar with active state
- [ ] Mobile bottom navigation
- [ ] Smooth transitions between routes
- [ ] User dropdown in header
- [ ] Logo/branding in header
- [ ] Responsive breakpoints working


---

### ═══════════════════════════════════════════════════════════════════
### TASK 4: Habits Module (Core Feature)
### ═══════════════════════════════════════════════════════════════════

**Assignee:** Agent 4
**Dependencies:** Task 1 (Database), Task 2 (UI), Task 3 (Layout)
**Estimated Time:** 2-3 hours

#### Files to Create

**API Routes:**
1. `app/api/habits/route.ts` - GET all habits, POST new habit
2. `app/api/habits/[id]/route.ts` - GET, PUT, DELETE single habit
3. `app/api/habits/[id]/complete/route.ts` - POST completion for today

**Client Fetchers:**
4. `lib/api/habits.ts`

**Hooks:**
5. `lib/hooks/use-habits.ts` - SWR hook for habits data

**Components:**
6. `components/habits/habit-card.tsx` - Single habit with tap-to-complete
7. `components/habits/habit-list.tsx` - List of habits for a day
8. `components/habits/habit-form.tsx` - Create/edit habit modal
9. `components/habits/habit-heatmap.tsx` - GitHub-style contribution grid
10. `components/habits/streak-badge.tsx` - Fire emoji + count
11. `components/habits/habit-stats.tsx` - Completion statistics

**Pages:**
12. `app/(dashboard)/habits/page.tsx` - All habits view
13. `app/(dashboard)/habits/[id]/page.tsx` - Single habit detail

**Utilities:**
14. `lib/utils/streaks.ts` - Streak calculation functions
15. `lib/utils/dates.ts` - Date helpers

#### API Specifications

```typescript
// GET /api/habits
// Returns all user habits with today's completion status
Response: {
  habits: HabitWithCompletions[]
}

// POST /api/habits
// Create new habit
Body: CreateHabitInput
Response: { habit: Habit }

// GET /api/habits/[id]
// Get habit with completions (last 90 days)
Response: { 
  habit: Habit
  completions: HabitCompletion[]
  streak: number
  stats: {
    total_completions: number
    completion_rate: number
    best_streak: number
  }
}

// PUT /api/habits/[id]
// Update habit
Body: UpdateHabitInput
Response: { habit: Habit }

// DELETE /api/habits/[id]
// Delete habit (and all completions)
Response: { success: true }

// POST /api/habits/[id]/complete
// Toggle completion for a date (default today)
Body: { date?: string, duration_minutes?: number, notes?: string }
Response: { 
  completed: boolean  // true if added, false if removed
  completion?: HabitCompletion
}
```

#### Component Specifications

**HabitCard:**
```typescript
interface HabitCardProps {
  habit: HabitWithCompletions
  onComplete: (habitId: string) => void
  onEdit: (habit: Habit) => void
  showStreak?: boolean
  compact?: boolean
}

// Visual: 
// - Rounded card with habit icon/color on left
// - Name and description
// - Streak badge if active
// - Large tap target for completion
// - Checkmark animation on complete
```

**HabitHeatmap:**
```typescript
interface HabitHeatmapProps {
  completions: HabitCompletion[]
  startDate?: Date  // Default 90 days ago
  endDate?: Date    // Default today
}

// Visual:
// - Grid of squares (like GitHub contributions)
// - Color intensity based on completion
// - Tooltips showing date and status
// - Month labels on top
// - Day labels on left (Mon, Wed, Fri)
```

#### Completion Criteria
- [ ] Can create habits with all frequency types
- [ ] One-tap completion (no forms)
- [ ] Undo completion within 5 seconds
- [ ] Streak calculation accurate
- [ ] Heatmap renders correctly
- [ ] Edit/archive/delete habits
- [ ] Mobile-optimized tap targets


---

### ═══════════════════════════════════════════════════════════════════
### TASK 5: Goals Module
### ═══════════════════════════════════════════════════════════════════

**Assignee:** Agent 5
**Dependencies:** Task 1 (Database), Task 2 (UI), Task 3 (Layout)
**Estimated Time:** 2 hours

#### Files to Create

**API Routes:**
1. `app/api/goals/route.ts`
2. `app/api/goals/[id]/route.ts`
3. `app/api/goals/[id]/milestones/route.ts`

**Client Fetchers:**
4. `lib/api/goals.ts`

**Hooks:**
5. `lib/hooks/use-goals.ts`

**Components:**
6. `components/goals/goal-card.tsx`
7. `components/goals/goal-list.tsx`
8. `components/goals/goal-form.tsx`
9. `components/goals/milestone-list.tsx`
10. `components/goals/milestone-item.tsx`
11. `components/goals/goal-progress-ring.tsx`

**Pages:**
12. `app/(dashboard)/goals/page.tsx`
13. `app/(dashboard)/goals/[id]/page.tsx`

#### Component Specifications

**GoalCard:**
```typescript
interface GoalCardProps {
  goal: GoalWithMilestones
  onClick?: () => void
}

// Visual:
// - Card with goal icon and color accent
// - Title and target date
// - Circular progress ring showing milestone completion
// - Category badge
// - Milestone count (e.g., "3 of 5 done")
```

**GoalProgressRing:**
```typescript
interface GoalProgressRingProps {
  progress: number  // 0-100
  size?: 'sm' | 'md' | 'lg'
  color?: string
  showLabel?: boolean
}

// Visual:
// - SVG circular progress
// - Animated on mount
// - Percentage in center (optional)
```

**MilestoneList:**
```typescript
interface MilestoneListProps {
  milestones: GoalMilestone[]
  onToggle: (id: string) => void
  onAdd: (title: string) => void
  onDelete: (id: string) => void
  onReorder: (ids: string[]) => void
}

// Visual:
// - Checklist style
// - Drag to reorder
// - Inline add new milestone
// - Strike-through completed
```

#### Completion Criteria
- [ ] Can create goals with milestones
- [ ] Progress calculated from milestones
- [ ] Toggle milestone completion
- [ ] Drag-to-reorder milestones
- [ ] Goal status management (active/completed/paused)
- [ ] Link goals to projects (optional)


---

### ═══════════════════════════════════════════════════════════════════
### TASK 6: Learning Module
### ═══════════════════════════════════════════════════════════════════

**Assignee:** Agent 6
**Dependencies:** Task 1 (Database), Task 2 (UI), Task 3 (Layout)
**Estimated Time:** 2 hours

#### Files to Create

**API Routes:**
1. `app/api/learning/route.ts`
2. `app/api/learning/[id]/route.ts`
3. `app/api/learning/[id]/sessions/route.ts`

**Client Fetchers:**
4. `lib/api/learning.ts`

**Hooks:**
5. `lib/hooks/use-learning.ts`

**Components:**
6. `components/learning/learning-card.tsx`
7. `components/learning/learning-list.tsx`
8. `components/learning/learning-form.tsx`
9. `components/learning/session-log.tsx`
10. `components/learning/progress-chart.tsx`

**Pages:**
11. `app/(dashboard)/learning/page.tsx`
12. `app/(dashboard)/learning/[id]/page.tsx`

#### Component Specifications

**LearningCard:**
```typescript
interface LearningCardProps {
  item: LearningItemWithSessions
  onClick?: () => void
}

// Visual:
// - Card with type icon (book, course, etc.)
// - Title and progress bar
// - Time invested badge
// - Status indicator
// - "Log Session" quick action button
```

**SessionLog:**
```typescript
interface SessionLogProps {
  sessions: LearningSession[]
  onAdd: (session: CreateSessionInput) => void
}

// Visual:
// - Timeline of sessions
// - Quick add form (duration + optional units)
// - Total time summary
```

**ProgressChart:**
```typescript
interface ProgressChartProps {
  sessions: LearningSession[]
  range?: 'week' | 'month' | 'all'
}

// Visual:
// - Bar chart of time per day/week
// - Optional: line chart overlay for units
```

#### Completion Criteria
- [ ] Can create learning items with different types
- [ ] Log sessions with duration and progress
- [ ] Progress bar shows units completed
- [ ] Time tracking accumulates correctly
- [ ] Resources can be added/linked
- [ ] Status management (active/paused/completed)


---

### ═══════════════════════════════════════════════════════════════════
### TASK 7: Bucket List, Projects, Wishlist Modules
### ═══════════════════════════════════════════════════════════════════

**Assignee:** Agent 7
**Dependencies:** Task 1 (Database), Task 2 (UI), Task 3 (Layout)
**Estimated Time:** 2 hours

#### Files to Create

**Bucket List:**
1. `app/api/bucket-list/route.ts`
2. `app/api/bucket-list/[id]/route.ts`
3. `lib/api/bucket-list.ts`
4. `components/bucket-list/bucket-item.tsx`
5. `components/bucket-list/bucket-list-grid.tsx`
6. `components/bucket-list/bucket-form.tsx`
7. `app/(dashboard)/bucket-list/page.tsx`

**Projects:**
8. `app/api/projects/route.ts`
9. `app/api/projects/[id]/route.ts`
10. `lib/api/projects.ts`
11. `components/projects/project-card.tsx`
12. `components/projects/project-board.tsx`
13. `components/projects/project-form.tsx`
14. `app/(dashboard)/projects/page.tsx`

**Wishlist:**
15. `app/api/wishlist/route.ts`
16. `app/api/wishlist/[id]/route.ts`
17. `lib/api/wishlist.ts`
18. `components/wishlist/wishlist-item.tsx`
19. `components/wishlist/wishlist-grid.tsx`
20. `components/wishlist/wishlist-form.tsx`
21. `app/(dashboard)/wishlist/page.tsx`

#### Component Specifications

**BucketListGrid:**
```typescript
// Visual:
// - Masonry or grid layout
// - Category filters (tabs or dropdown)
// - Completed items show faded with checkmark
// - Priority badges (soon, this year, someday)
// - Empty state encouragement
```

**ProjectBoard:**
```typescript
// Visual:
// - Kanban columns: Idea | Planned | Active | Paused | Completed
// - Drag to change status
// - Cards show name, description snippet, linked goal
// - Quick status change via dropdown
```

**WishlistGrid:**
```typescript
// Visual:
// - Card grid with item image/icon
// - Priority stars (1-3)
// - Price if available
// - Status badge
// - Quick status change buttons
```

#### Completion Criteria
- [ ] Bucket list with categories and priorities
- [ ] Mark bucket items complete with notes/photo
- [ ] Projects kanban with drag-and-drop
- [ ] Projects can link to goals
- [ ] Wishlist with price tracking
- [ ] Status transitions work correctly


---

### ═══════════════════════════════════════════════════════════════════
### TASK 8: Dashboard Home Page
### ═══════════════════════════════════════════════════════════════════

**Assignee:** Agent 8
**Dependencies:** Tasks 4, 5, 6, 7 (All modules)
**Estimated Time:** 1-2 hours

#### Files to Create

1. `app/(dashboard)/page.tsx` - Main dashboard
2. `components/dashboard/today-habits.tsx`
3. `components/dashboard/active-goals.tsx`
4. `components/dashboard/learning-summary.tsx`
5. `components/dashboard/streak-summary.tsx`
6. `components/dashboard/weekly-progress.tsx`

#### Specifications

**Dashboard Layout:**
```
Desktop (3 columns):
┌──────────────────┬──────────────────┬──────────────────┐
│ Greeting +       │ Today's Habits   │ Streak Summary   │
│ Date             │ (scrollable)     │ + Weekly Bar     │
├──────────────────┼──────────────────┼──────────────────┤
│ Active Goals     │ Active Goals     │ Learning         │
│ (progress rings) │ (cont.)          │ (recent items)   │
└──────────────────┴──────────────────┴──────────────────┘

Mobile (single column):
┌─────────────────────┐
│ Greeting + Streak   │
├─────────────────────┤
│ Today's Habits      │
├─────────────────────┤
│ Active Goals        │
├─────────────────────┤
│ Learning            │
└─────────────────────┘
```

**TodayHabits:**
- Shows habits scheduled for today
- One-tap completion inline
- Shows current streak per habit
- "All done!" celebration when complete

**ActiveGoals:**
- Top 3-5 active goals with progress rings
- Click to navigate to detail
- "View all" link

**LearningSummary:**
- Active learning items
- Recent sessions logged
- Total time this week

**StreakSummary:**
- Overall streak (longest current)
- Weekly completion bar (Mon-Sun)
- Percentage complete today

#### Completion Criteria
- [ ] Dashboard loads with all sections
- [ ] Data fetched efficiently (parallel queries)
- [ ] Habit completion works inline
- [ ] Responsive grid layout
- [ ] Loading skeletons
- [ ] Empty states for each section


---

### ═══════════════════════════════════════════════════════════════════
### TASK 9: Insights & Analytics Page
### ═══════════════════════════════════════════════════════════════════

**Assignee:** Agent 9
**Dependencies:** Tasks 4, 5, 6 (Habits, Goals, Learning)
**Estimated Time:** 1-2 hours

#### Files to Create

1. `app/(dashboard)/insights/page.tsx`
2. `components/insights/habit-analytics.tsx`
3. `components/insights/goal-timeline.tsx`
4. `components/insights/monthly-summary.tsx`
5. `lib/utils/analytics.ts` - Calculation helpers

#### Specifications

**HabitAnalytics:**
- Completion rate over time (line chart)
- Best/worst days of week
- Streak history
- Most consistent habits

**GoalTimeline:**
- Timeline of milestone completions
- Goals completed over time
- Average time to complete goals

**MonthlySummary:**
- Total habit completions this month
- Goals progressed
- Learning time logged
- Bucket items achieved

#### Completion Criteria
- [ ] Charts render correctly (use simple SVG or Chart.js)
- [ ] Date range selector (week/month/year/all)
- [ ] Stats calculated accurately
- [ ] Mobile-friendly charts


---

### ═══════════════════════════════════════════════════════════════════
### TASK 10: PWA Setup
### ═══════════════════════════════════════════════════════════════════

**Assignee:** Agent 10
**Dependencies:** Task 2 (Design - needs icons)
**Estimated Time:** 1 hour

#### Files to Create

1. `app/manifest.ts` - Next.js 14 manifest
2. `public/sw.js` - Service worker (or use next-pwa)
3. `public/icons/icon-192.png`
4. `public/icons/icon-512.png`
5. `public/icons/apple-touch-icon.png`
6. Update `app/layout.tsx` - Meta tags

#### Specifications

**manifest.ts:**
```typescript
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Life OS',
    short_name: 'Life OS',
    description: 'Your personal life dashboard',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0f14',
    theme_color: '#0a0f14',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
```

**Service Worker Strategy:**
- Cache static assets (CSS, JS, fonts)
- Cache API responses with stale-while-revalidate
- Offline fallback page

#### Completion Criteria
- [ ] App installable on iOS/Android
- [ ] Icons display correctly
- [ ] Theme color matches app
- [ ] Basic offline support
- [ ] No console errors


---

### ═══════════════════════════════════════════════════════════════════
### TASK 11: Settings Page
### ═══════════════════════════════════════════════════════════════════

**Assignee:** Agent 11
**Dependencies:** Task 1 (Database - user_preferences)
**Estimated Time:** 30 minutes

#### Files to Create

1. `app/(dashboard)/settings/page.tsx`
2. `app/api/settings/route.ts` - GET/PUT preferences
3. `lib/api/settings.ts`

#### Specifications

**Settings Sections:**
- Theme selection (midnight/forest/sunset/mono)
- Week starts on (Sunday/Monday)
- Export data (JSON download)
- Account info (read-only)
- Sign out

#### Completion Criteria
- [x] Theme persists after page reload
- [x] Theme applies immediately
- [x] Export downloads valid JSON
- [x] Sign out works correctly


---

## Execution Order & Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                         PHASE 1                                 │
│                    (Start Immediately)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   TASK 1          TASK 2           TASK 10                     │
│   Database        Design System     PWA Setup                   │
│   Schema          UI Components     (icons, manifest)           │
│      │                │                  │                      │
│      │                │                  │                      │
│      └────────────────┼──────────────────┘                      │
│                       │                                         │
└───────────────────────┼─────────────────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────────────────┐
│                       │         PHASE 2                         │
│                       ▼     (After Phase 1)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   TASK 3           TASK 11                                      │
│   Layout &         Settings                                     │
│   Navigation       Page                                         │
│      │                │                                         │
│      │                │                                         │
└──────┼────────────────┼─────────────────────────────────────────┘
       │                │
       ▼                │
┌─────────────────────────────────────────────────────────────────┐
│                         PHASE 3                                 │
│                 (After Layout Ready)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   TASK 4          TASK 5          TASK 6          TASK 7       │
│   Habits          Goals           Learning        Bucket/       │
│   Module          Module          Module          Projects/     │
│                                                   Wishlist      │
│      │               │               │               │          │
│      └───────────────┴───────────────┴───────────────┘          │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         PHASE 4                                 │
│                  (After All Modules)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   TASK 8                      TASK 9                            │
│   Dashboard                   Insights                          │
│   Home Page                   Analytics                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Parallel Execution Groups

**Can run simultaneously:**
- Group A: Task 1 + Task 2 + Task 10
- Group B: Task 3 + Task 11 (after Group A)
- Group C: Task 4 + Task 5 + Task 6 + Task 7 (after Task 3)
- Group D: Task 8 + Task 9 (after Group C)

## Shared Interfaces (Critical for Parallel Work)

All agents must use the types defined in `types/index.ts` (Task 1).

**API Response Format (standardized):**
```typescript
// Success
{ data: T }

// Error
{ error: { message: string, code?: string } }

// List response
{ data: T[], count?: number }
```

**Component Props Pattern:**
```typescript
interface ComponentProps {
  data: EntityType
  onAction?: (id: string) => void
  loading?: boolean
  className?: string
}
```

## Testing Checklist (Per Module)

After each task, verify:
- [ ] API routes return correct data
- [ ] RLS policies work (can only see own data)
- [ ] Components render without errors
- [ ] Mobile layout looks correct
- [ ] Loading states display
- [ ] Error states handle gracefully
- [ ] Data persists after refresh

---

*Generated: January 1, 2026*

