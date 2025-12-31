import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './types'

/**
 * Supabase client for server-side usage (Server Components, Server Actions, API Routes)
 * This client uses cookies to maintain the user's session
 */
export async function createClient() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase/server.ts:9',message:'createClient entry',data:{hasUrl:!!process.env.NEXT_PUBLIC_SUPABASE_URL,hasKey:!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const cookieStore = await cookies()
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase/server.ts:13',message:'Cookie store obtained',data:{cookieCount:cookieStore.getAll().length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  const client = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase/server.ts:23',message:'setAll called',data:{cookieCount:cookiesToSet.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase/server.ts:28',message:'setAll success',data:{setCount:cookiesToSet.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
          } catch (err) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase/server.ts:32',message:'setAll error',data:{errorMessage:err instanceof Error?err.message:'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase/server.ts:40',message:'createClient exit',data:{clientCreated:!!client},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  return client
}

