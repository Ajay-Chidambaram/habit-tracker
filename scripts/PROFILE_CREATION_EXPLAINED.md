# Profile Creation - How It Works

## Quick Answer

**You only need to run the profile creation script ONCE for existing users.** After that, all new users get profiles automatically.

## The Two Scenarios

### Scenario 1: Users Who Signed Up BEFORE Migration ⚠️
**Action Required:** Run the profile creation script once

- These users existed before you created the `profiles` table
- The database trigger wasn't active when they signed up
- You need to manually create their profiles

**Solution:** Run `scripts/create-existing-user-profile.sql` (use Option 2 to handle all users at once)

### Scenario 2: Users Who Sign Up AFTER Migration ✅
**Action Required:** Nothing! It's automatic

- The migration creates a database trigger
- When a new user signs up, the trigger automatically creates their profile
- No manual intervention needed

## How the Automatic Trigger Works

The migration includes this trigger:

```sql
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

This means:
1. User signs up → Supabase creates entry in `auth.users`
2. Trigger fires automatically
3. Profile created in `public.profiles` table
4. Done! ✨

## Recommended Approach

1. **Run the migration** (`001_initial_schema.sql`)
2. **Run the profile script ONCE** using Option 2 (creates profiles for all existing users)
3. **That's it!** All future users are handled automatically

## Example Timeline

```
Day 1: You sign up → User created in auth.users
Day 2: You run migration → Tables + trigger created
Day 3: You run profile script → Your profile created manually
Day 4: Friend signs up → Their profile created automatically by trigger ✅
Day 5: Another friend signs up → Their profile created automatically ✅
```

## Summary

- **Existing users (before migration):** Run script once
- **New users (after migration):** Automatic via trigger
- **You only do this once:** After initial migration setup

