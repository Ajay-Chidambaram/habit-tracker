import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * OAuth callback route handler
 * Handles the redirect from Supabase after OAuth authentication
 */
export async function GET(request: NextRequest) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/auth/callback/route.ts:9',message:'Callback route entry',data:{url:request.url,hasCode:!!request.nextUrl.searchParams.get('code')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  console.log('[AUTH_CALLBACK] Route called', { url: request.url, timestamp: new Date().toISOString() })
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const urlError = requestUrl.searchParams.get('error')
    const errorDescription = requestUrl.searchParams.get('error_description')
    const next = requestUrl.searchParams.get('next') || '/'
    console.log('[AUTH_CALLBACK] Parsed params', { 
      hasCode: !!code, 
      codeLength: code?.length, 
      hasError: !!urlError,
      urlError,
      errorDescription,
      next, 
      origin: requestUrl.origin,
      fullUrl: request.url
    })
    
    // Check if Supabase redirected with an error
    if (urlError) {
      console.error('[AUTH_CALLBACK] Supabase returned error', { error: urlError, errorDescription })
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(errorDescription || urlError || 'Authentication failed')}`,
          requestUrl.origin
        )
      )
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/auth/callback/route.ts:15',message:'Parsed request params',data:{code:code?code.substring(0,20)+'...':null,next,origin:requestUrl.origin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    // Check if environment variables are set
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/auth/callback/route.ts:20',message:'Environment variables check',data:{hasUrl,hasKey,urlLength:process.env.NEXT_PUBLIC_SUPABASE_URL?.length||0,keyLength:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    console.log('[AUTH_CALLBACK] Env check', { hasUrl, hasKey, urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) })
    if (!hasUrl || !hasKey) {
      console.error('[AUTH_CALLBACK] Missing Supabase environment variables', { hasUrl, hasKey })
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent('Server configuration error. Please contact support.')}`,
          requestUrl.origin
        )
      )
    }

    if (!code) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/auth/callback/route.ts:32',message:'No code provided',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.error('No authorization code provided')
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent('No authorization code received')}`,
          requestUrl.origin
        )
      )
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/auth/callback/route.ts:42',message:'Before Supabase client creation',data:{codeLength:code.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    const supabase = await createClient()
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/auth/callback/route.ts:45',message:'After Supabase client creation',data:{clientCreated:!!supabase},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/auth/callback/route.ts:48',message:'Before code exchange',data:{codeLength:code.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    console.log('[AUTH_CALLBACK] Attempting code exchange', { codeLength: code.length })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/auth/callback/route.ts:50',message:'After code exchange',data:{hasError:!!error,errorMessage:error?.message,hasSession:!!data?.session,hasUser:!!data?.user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    console.log('[AUTH_CALLBACK] Code exchange result', { 
      hasError: !!error, 
      errorMessage: error?.message, 
      errorStatus: error?.status,
      hasSession: !!data?.session,
      hasUser: !!data?.user,
      userId: data?.user?.id 
    })
    
    if (error) {
      console.error('[AUTH_CALLBACK] Error exchanging code for session:', { 
        message: error.message, 
        status: error.status,
        name: error.name,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
      })
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(error.message || 'Authentication failed')}`,
          requestUrl.origin
        )
      )
    }

    if (!data.session) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/auth/callback/route.ts:62',message:'No session after exchange',data:{hasData:!!data,hasUser:!!data?.user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.error('No session created after code exchange')
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent('Failed to create session')}`,
          requestUrl.origin
        )
      )
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/auth/callback/route.ts:72',message:'Success - redirecting',data:{next,hasSession:!!data.session},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // Redirect to the dashboard or the originally requested page
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/auth/callback/route.ts:76',message:'Unexpected error caught',data:{errorMessage:error instanceof Error?error.message:'unknown',errorStack:error instanceof Error?error.stack:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    console.error('Unexpected error in auth callback:', error)
    const requestUrl = new URL(request.url)
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(
          error instanceof Error ? error.message : 'An unexpected error occurred'
        )}`,
        requestUrl.origin
      )
    )
  }
}

