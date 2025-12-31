# Running the Database Migration

## Quick Steps

You need to run the SQL migration to create all the database tables. Here's the easiest way:

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase project dashboard:**
   - Visit https://supabase.com/dashboard
   - Select your project (the one with URL starting with `iaavyduzzxrm`)

2. **Open the SQL Editor:**
   - Click on **"SQL Editor"** in the left sidebar
   - Click **"New query"**

3. **Copy and paste the migration:**
   - Open the file: `supabase/migrations/001_initial_schema.sql`
   - Copy the entire contents (all 345 lines)
   - Paste into the SQL Editor

4. **Run the migration:**
   - Click **"Run"** button (or press `Cmd/Ctrl + Enter`)
   - Wait for it to complete (should take a few seconds)

5. **Verify success:**
   - You should see a success message
   - Go to **"Table Editor"** in the sidebar
   - You should see these tables:
     - ✅ `profiles`
     - ✅ `weekly_entries`
     - ✅ `habits`
     - ✅ `side_projects`
     - ✅ `purchases_research`
     - ✅ `experiences_travel`

### Option 2: Using Supabase CLI (If you have it installed)

```bash
# Link your project (you'll need your project ref from the dashboard)
supabase link --project-ref YOUR_PROJECT_REF

# Run the migration
supabase db push
```

## After Running the Migration

1. **Create a profile for your existing user:**
   Since you're already authenticated (your user ID: `0ec31460-5762-4d48-ba95-7adb1331217c`), you need to manually create a profile entry. Run this SQL in the SQL Editor:

   ```sql
   -- Create profile for existing authenticated user
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
   ```

   **Or** create a profile for all existing users (if you have multiple):

   ```sql
   -- Create profiles for all existing users
   INSERT INTO public.profiles (id, email, full_name, avatar_url)
   SELECT 
     id,
     email,
     COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', 'User'),
     raw_user_meta_data->>'avatar_url'
   FROM auth.users
   WHERE id NOT IN (SELECT id FROM public.profiles)
   ON CONFLICT (id) DO NOTHING;
   ```

2. **Test again:**
   - Visit: `http://localhost:3000/api/test-auth`
   - You should now see:
     - `"connected": true` for the database
     - Your user profile information

## Troubleshooting

- **"relation already exists"**: Some tables might already exist. The migration uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run again.
- **"permission denied"**: Make sure you're running the SQL as the project owner/admin
- **"policy already exists"**: Policies might already exist. You can drop and recreate them if needed, or the migration will handle it with `CREATE POLICY IF NOT EXISTS` (though it doesn't use that - you may need to drop existing policies first if you get errors)

