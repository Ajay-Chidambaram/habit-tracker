-- ============================================================================
-- Create Profiles for Existing Users
-- ============================================================================
-- 
-- IMPORTANT: This script is ONLY needed for users who signed up BEFORE 
--            you ran the database migration (001_initial_schema.sql)
--
-- NEW users (who sign up AFTER the migration) will automatically get 
-- profiles created via the database trigger - no manual action needed!
--
-- ============================================================================

-- OPTION 1: Create profile for a specific user (replace the user ID)
-- Use this if you only have one or a few existing users
INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', 'User'),
  raw_user_meta_data->>'avatar_url'
FROM auth.users
WHERE id = '0ec31460-5762-4d48-ba95-7adb1331217c'
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);

-- ============================================================================
-- OPTION 2: Create profiles for ALL existing users at once (RECOMMENDED)
-- ============================================================================
-- Uncomment the block below to create profiles for all users who don't have one
-- This is the easiest way if you have multiple existing users

-- INSERT INTO public.profiles (id, email, full_name, avatar_url)
-- SELECT 
--   id,
--   email,
--   COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', 'User'),
--   raw_user_meta_data->>'avatar_url'
-- FROM auth.users
-- WHERE id NOT IN (SELECT id FROM public.profiles)
-- ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- How It Works:
-- ============================================================================
-- 1. The migration creates a trigger that automatically creates profiles 
--    for NEW users when they sign up
-- 2. This script handles users who existed BEFORE the migration
-- 3. After running this once, you never need to run it again
-- 4. All future users will get profiles automatically

