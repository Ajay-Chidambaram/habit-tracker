# Testing Supabase Authentication

## Quick Test

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the authentication endpoint:**
   Open your browser and navigate to:
   ```
   http://localhost:3000/api/test-auth
   ```

   This will show you:
   - ✅ If environment variables are set correctly
   - ✅ If Supabase client can connect
   - ✅ If database connection works
   - ✅ Current authentication status

3. **Test the login flow:**
   - Navigate to: `http://localhost:3000/login`
   - Click "Sign in with Google"
   - You should be redirected to Google OAuth
   - After authentication, you'll be redirected back to `/dashboard`

## What to Check

### Environment Variables
Make sure your `.env.local` file contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (your anon key)
```

### Expected Test Results

**If everything is working:**
```json
{
  "success": true,
  "message": "Supabase authentication is configured correctly",
  "details": {
    "environment": {
      "url": "https://xxxxx.supabase...",
      "hasAnonKey": true,
      "anonKeyLength": 200+
    },
    "auth": {
      "user": null,  // null if not logged in
      "error": null
    },
    "database": {
      "connected": true,
      "error": null
    }
  }
}
```

**If there are issues:**
- Missing environment variables → Check `.env.local`
- Database connection error → Verify Supabase URL and anon key
- Auth error → Check OAuth configuration in Supabase dashboard

## Common Issues

1. **"Missing environment variables"**
   - Make sure `.env.local` exists in the project root
   - Restart the dev server after updating `.env.local`

2. **"Failed to fetch" or CORS errors**
   - Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
   - Check that your Supabase project is active

3. **"Invalid API key"**
   - Double-check `NEXT_PUBLIC_SUPABASE_ANON_KEY` matches your Supabase dashboard
   - Make sure you're using the "anon/public" key, not the service_role key

4. **OAuth not working**
   - Verify Google OAuth is configured in Supabase dashboard
   - Check that redirect URL is set to: `http://localhost:3000/auth/callback`
   - For production, add your production URL to allowed redirect URLs

