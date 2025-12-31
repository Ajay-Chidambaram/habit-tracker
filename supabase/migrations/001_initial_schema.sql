-- Weekly Habit & Goal Tracker - Initial Schema
-- This migration creates all tables, triggers, and RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
-- Auto-created from auth.users via trigger
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 2. WEEKLY_ENTRIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.weekly_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

-- Enable RLS on weekly_entries
ALTER TABLE public.weekly_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for weekly_entries
CREATE POLICY "Users can view their own entries"
    ON public.weekly_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own entries"
    ON public.weekly_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
    ON public.weekly_entries FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
    ON public.weekly_entries FOR DELETE
    USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_weekly_entries_user_id ON public.weekly_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_entries_week_start ON public.weekly_entries(week_start);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_weekly_entries_updated_at
    BEFORE UPDATE ON public.weekly_entries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 3. HABITS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID NOT NULL REFERENCES public.weekly_entries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_frequency INTEGER NOT NULL DEFAULT 1,
    completed_count INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on habits
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for habits (users can only access habits from their own entries)
CREATE POLICY "Users can view habits from their own entries"
    ON public.habits FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = habits.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create habits in their own entries"
    ON public.habits FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = habits.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update habits in their own entries"
    ON public.habits FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = habits.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete habits from their own entries"
    ON public.habits FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = habits.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_habits_entry_id ON public.habits(entry_id);

-- ============================================================================
-- 4. SIDE_PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.side_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID NOT NULL REFERENCES public.weekly_entries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    goal TEXT,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    notes TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on side_projects
ALTER TABLE public.side_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for side_projects
CREATE POLICY "Users can view projects from their own entries"
    ON public.side_projects FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = side_projects.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create projects in their own entries"
    ON public.side_projects FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = side_projects.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update projects in their own entries"
    ON public.side_projects FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = side_projects.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete projects from their own entries"
    ON public.side_projects FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = side_projects.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_side_projects_entry_id ON public.side_projects(entry_id);

-- ============================================================================
-- 5. PURCHASES_RESEARCH TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.purchases_research (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID NOT NULL REFERENCES public.weekly_entries(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'purchase' CHECK (category IN ('purchase', 'research')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status TEXT NOT NULL DEFAULT 'researching' CHECK (status IN ('researching', 'decided', 'purchased', 'dropped')),
    notes TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on purchases_research
ALTER TABLE public.purchases_research ENABLE ROW LEVEL SECURITY;

-- RLS Policies for purchases_research
CREATE POLICY "Users can view purchases from their own entries"
    ON public.purchases_research FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = purchases_research.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create purchases in their own entries"
    ON public.purchases_research FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = purchases_research.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update purchases in their own entries"
    ON public.purchases_research FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = purchases_research.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete purchases from their own entries"
    ON public.purchases_research FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = purchases_research.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_purchases_research_entry_id ON public.purchases_research(entry_id);

-- ============================================================================
-- 6. EXPERIENCES_TRAVEL TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.experiences_travel (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID NOT NULL REFERENCES public.weekly_entries(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    planned_date DATE,
    type TEXT NOT NULL DEFAULT 'experience' CHECK (type IN ('travel', 'event', 'experience')),
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'booked', 'completed')),
    notes TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on experiences_travel
ALTER TABLE public.experiences_travel ENABLE ROW LEVEL SECURITY;

-- RLS Policies for experiences_travel
CREATE POLICY "Users can view experiences from their own entries"
    ON public.experiences_travel FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = experiences_travel.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create experiences in their own entries"
    ON public.experiences_travel FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = experiences_travel.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update experiences in their own entries"
    ON public.experiences_travel FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = experiences_travel.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete experiences from their own entries"
    ON public.experiences_travel FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.weekly_entries
            WHERE weekly_entries.id = experiences_travel.entry_id
            AND weekly_entries.user_id = auth.uid()
        )
    );

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_experiences_travel_entry_id ON public.experiences_travel(entry_id);

