'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface LoginButtonProps {
  redirectTo?: string
  className?: string
}

export function LoginButton({ redirectTo = '/dashboard', className = '' }: LoginButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSignIn = async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/auth/LoginButton.tsx:16',message:'handleSignIn entry',data:{redirectTo},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    try {
      setLoading(true)
      setError(null)
      const baseUrl = window.location.origin
      const callbackUrl = `${baseUrl}/auth/callback`
      // Use just the callback URL without query params - we'll handle next in the callback
      const redirectUrl = callbackUrl
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/auth/LoginButton.tsx:23',message:'Before OAuth call',data:{baseUrl,callbackUrl,redirectUrl,hasSupabaseUrl:!!process.env.NEXT_PUBLIC_SUPABASE_URL},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.log('[LOGIN_BUTTON] Initiating OAuth', { 
        baseUrl, 
        callbackUrl, 
        redirectUrl,
        redirectTo,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      })

      const oauthOptions = {
        redirectTo: redirectUrl,
        queryParams: {
          next: redirectTo, // This will be passed to our callback route
        },
        scopes: 'email profile',
      }
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/auth/LoginButton.tsx:40',message:'Calling signInWithOAuth',data:{provider:'google',options:oauthOptions},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: oauthOptions,
      })
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/58d7e182-4b22-40ea-867c-1026a93d817b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/auth/LoginButton.tsx:45',message:'OAuth response received',data:{hasError:!!error,errorMessage:error?.message,errorStatus:error?.status,hasData:!!data,hasUrl:!!data?.url,urlPrefix:data?.url?.substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.log('[LOGIN_BUTTON] OAuth response', { 
        hasError: !!error, 
        errorMessage: error?.message,
        errorStatus: error?.status,
        hasData: !!data,
        url: data?.url?.substring(0, 100),
        fullError: error ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : null
      })

      if (error) {
        console.error('[LOGIN_BUTTON] Error signing in:', { 
          message: error.message, 
          status: error.status,
          name: error.name,
          fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
        })
        setError(`Error: ${error.message}`)
        alert(`Error signing in: ${error.message}`)
      } else if (data?.url) {
        // OAuth flow initiated successfully - redirect will happen automatically
        console.log('[LOGIN_BUTTON] Redirecting to OAuth provider', { url: data.url.substring(0, 150) })
        window.location.href = data.url
      }
    } catch (error) {
      console.error('[LOGIN_BUTTON] Unexpected error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(errorMessage)
      alert(`An unexpected error occurred: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-3
        bg-white text-gray-900
        rounded-lg
        font-medium
        transition-all duration-200
        hover:bg-gray-100
        active:bg-gray-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900
        ${className}
      `}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Signing in...
        </>
      ) : (
        <>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </>
      )}
    </button>
  )
}

