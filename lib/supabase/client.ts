import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

/**
 * Supabase client for browser/client-side usage
 * This client is used in Client Components and client-side code
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

