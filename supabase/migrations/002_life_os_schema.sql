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
