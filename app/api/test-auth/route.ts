import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Test endpoint to verify Supabase authentication setup
 * GET /api/test-auth
 */
export async function GET() {
  try {
    // Check if environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing environment variables',
          details: {
            hasUrl: !!supabaseUrl,
            hasAnonKey: !!supabaseAnonKey,
          },
        },
        { status: 500 }
      )
    }

    // Test Supabase client creation
    const supabase = await createClient()

    // Test connection by getting the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    // Test database connection by querying a simple table
    const { error: dbError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    return NextResponse.json({
      success: true,
      message: 'Supabase authentication is configured correctly',
      details: {
        environment: {
          url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing',
          hasAnonKey: !!supabaseAnonKey,
          anonKeyLength: supabaseAnonKey?.length || 0,
        },
        auth: {
          user: user ? { id: user.id, email: user.email } : null,
          error: userError?.message || null,
        },
        database: {
          connected: !dbError,
          error: dbError?.message || null,
        },
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unexpected error',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

