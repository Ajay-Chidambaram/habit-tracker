import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Diagnostic endpoint to check OAuth configuration
 * GET /api/diagnose-auth
 */
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('[DIAGNOSE_AUTH] Checking configuration', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      url: supabaseUrl?.substring(0, 50)
    })

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: { hasUrl: !!supabaseUrl, hasKey: !!supabaseAnonKey }
      }, { status: 500 })
    }

    const supabase = await createClient()
    
    // Try to get auth settings (this might not work with anon key, but worth trying)
    // Check if we can at least connect
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    // Extract project reference from URL
    const projectRef = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1]
    
    return NextResponse.json({
      success: true,
      configuration: {
        supabaseUrl: supabaseUrl.substring(0, 50) + '...',
        hasAnonKey: !!supabaseAnonKey,
        anonKeyLength: supabaseAnonKey?.length || 0,
        projectRef,
        expectedCallbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://habit-tracker-ten-blue.vercel.app'}/auth/callback`,
        expectedSupabaseCallback: `https://${projectRef}.supabase.co/auth/v1/callback`
      },
      auth: {
        currentUser: user ? { id: user.id, email: user.email } : null,
        error: userError?.message || null
      },
      recommendations: {
        siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://habit-tracker-ten-blue.vercel.app',
        redirectUrls: [
          `${process.env.NEXT_PUBLIC_APP_URL || 'https://habit-tracker-ten-blue.vercel.app'}/auth/callback`,
          'http://localhost:3000/auth/callback'
        ],
        googleOAuthRedirectUri: `https://${projectRef}.supabase.co/auth/v1/callback`
      }
    })
  } catch (error) {
    console.error('[DIAGNOSE_AUTH] Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Diagnostic failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

