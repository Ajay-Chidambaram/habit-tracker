# Supabase Database Setup Guide

This document provides step-by-step instructions for setting up the Supabase database for the Weekly Habit & Goal Tracker application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed
- Access to your Supabase project dashboard

---

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in (or create an account)
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: `habit-tracker` (or your preferred name)
   - **Database Password**: Choose a strong password (save this securely)
   - **Region**: Select the region closest to you
   - **Pricing Plan**: Free tier is sufficient for this project
4. Click **"Create new project"**
5. Wait for the project to be provisioned (takes 1-2 minutes)

---

## Step 2: Get Your Project Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

---

## Step 3: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase credentials:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Important**: Never commit `.env.local` to git (it's already in `.gitignore`)

---

## Step 4: Run Database Migration

You have two options to run the migration:

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **"New query"**
4. Open the file `supabase/migrations/001_initial_schema.sql`
5. Copy the entire contents of the file
6. Paste it into the SQL Editor
7. Click **"Run"** (or press `Cmd/Ctrl + Enter`)
8. Verify that all tables were created successfully

### Option B: Using Supabase CLI (Advanced)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   (Find your project ref in the project settings)

3. Run the migration:
   ```bash
   supabase db push
   ```

---

## Step 5: Verify Tables and RLS

1. In Supabase dashboard, go to **Table Editor**
2. Verify the following tables exist:
   - ✅ `profiles`
   - ✅ `weekly_entries`
   - ✅ `habits`
   - ✅ `side_projects`
   - ✅ `purchases_research`
   - ✅ `experiences_travel`

3. Check Row Level Security (RLS):
   - Go to **Authentication** → **Policies**
   - Verify that RLS is enabled on all tables
   - Each table should have policies for SELECT, INSERT, UPDATE, DELETE

---

## Step 6: Generate TypeScript Types

After running the migration, generate TypeScript types from your database schema:

### Option A: Using Supabase Dashboard

1. Go to **Settings** → **API**
2. Scroll down to **"Generate types"**
3. Select **TypeScript**
4. Copy the generated types
5. Replace the contents of `lib/supabase/types.ts` with the generated types

### Option B: Using Supabase CLI

```bash
# If using Supabase CLI locally
supabase gen types typescript --local > lib/supabase/types.ts

# Or for remote project
supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
```

### Option C: Using npx (No CLI installation needed)

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
```

You'll need your project ID, which can be found in your project settings or URL.

---

## Step 7: Verify Setup

1. Test the Supabase client connection:
   ```bash
   npm run dev
   ```

2. The application should start without errors related to Supabase

3. Check the browser console for any connection errors

---

## Database Schema Overview

### Tables

1. **profiles** - User profile information (auto-created from auth.users)
2. **weekly_entries** - Main entries for each week
3. **habits** - Habits tracked in each weekly entry
4. **side_projects** - Side projects tracked in each weekly entry
5. **purchases_research** - Purchase/research items tracked in each weekly entry
6. **experiences_travel** - Travel/experiences tracked in each weekly entry

### Relationships

- `weekly_entries.user_id` → `profiles.id`
- `habits.entry_id` → `weekly_entries.id`
- `side_projects.entry_id` → `weekly_entries.id`
- `purchases_research.entry_id` → `weekly_entries.id`
- `experiences_travel.entry_id` → `weekly_entries.id`

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Users can only create/update/delete their own entries
- All operations are scoped to the authenticated user

---

## Troubleshooting

### Migration Fails

- **Error: "relation already exists"**: Tables may already exist. Drop them first or use `CREATE TABLE IF NOT EXISTS` (already included in migration)
- **Error: "permission denied"**: Ensure you're using the correct database user credentials
- **Error: "extension does not exist"**: The migration includes `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"` which should handle this

### Type Generation Fails

- **Error: "Project not found"**: Verify your project ID is correct
- **Error: "Authentication failed"**: Make sure you're logged in to Supabase CLI or using the correct project ID

### Client Connection Issues

- **Error: "Invalid API key"**: Double-check your `.env.local` file has the correct keys
- **Error: "Failed to fetch"**: Check that `NEXT_PUBLIC_SUPABASE_URL` is correct and accessible
- **CORS errors**: Ensure your Supabase project allows requests from your domain

### RLS Policy Issues

- **"new row violates row-level security policy"**: Verify that:
  1. User is authenticated
  2. RLS policies are correctly set up
  3. The user_id matches `auth.uid()`

---

## Next Steps

After completing this setup:

1. ✅ Database schema is ready
2. ✅ RLS policies are configured
3. ✅ TypeScript types are generated
4. ✅ Client utilities are ready to use

**Proceed to**: Agent 3 will implement authentication using these Supabase clients.

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase TypeScript Guide](https://supabase.com/docs/guides/api/generating-types)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

## Dependencies Added

This setup requires the following npm packages (already installed):
- `@supabase/supabase-js` - Supabase JavaScript client
- `@supabase/ssr` - Supabase SSR utilities for Next.js

---

*Last Updated: December 31, 2024*

