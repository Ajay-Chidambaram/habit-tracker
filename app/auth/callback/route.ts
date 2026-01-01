import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * OAuth callback route handler
 * Handles the redirect from Supabase after OAuth authentication
 */
export async function GET(request: NextRequest) {
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

    // Check if environment variables are set
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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
      console.error('No authorization code provided')
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent('No authorization code received')}`,
          requestUrl.origin
        )
      )
    }

    const supabase = await createClient()
    console.log('[AUTH_CALLBACK] Attempting code exchange', { codeLength: code.length })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
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
      console.error('No session created after code exchange')
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent('Failed to create session')}`,
          requestUrl.origin
        )
      )
    }

    // Redirect to the dashboard or the originally requested page
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  } catch (error) {
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

