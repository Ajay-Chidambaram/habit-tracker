import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getServerUser } from '@/lib/auth/helpers'
import { ApiResponse, EntryListResponse, CreateEntryRequest } from '@/types/api'

/**
 * GET /api/entries
 * List all weekly entries for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    const { data: entries, error } = await supabase
      .from('weekly_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('week_start', { ascending: false })

    if (error) {
      console.error('Error fetching entries:', error)
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Failed to fetch entries' },
        { status: 500 }
      )
    }

    return NextResponse.json<ApiResponse<EntryListResponse>>({
      data: { entries: entries || [] },
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/entries:', error)
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/entries
 * Create a new weekly entry
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: CreateEntryRequest = await request.json()
    const { week_start } = body

    // Validate week_start
    if (!week_start || !/^\d{4}-\d{2}-\d{2}$/.test(week_start)) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Invalid week_start format. Expected YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Verify it's a Monday (optional validation)
    const date = new Date(week_start)
    const dayOfWeek = date.getDay()
    if (dayOfWeek !== 1) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'week_start must be a Monday' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Check if entry already exists for this week
    const { data: existing } = await supabase
      .from('weekly_entries')
      .select('id')
      .eq('user_id', user.id)
      .eq('week_start', week_start)
      .single()

    if (existing) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Entry already exists for this week' },
        { status: 409 }
      )
    }

    // Create new entry
    const { data: entry, error } = await supabase
      .from('weekly_entries')
      .insert({
        user_id: user.id,
        week_start,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating entry:', error)
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Failed to create entry' },
        { status: 500 }
      )
    }

    return NextResponse.json<ApiResponse<{ entry: typeof entry }>>(
      { data: { entry } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error in POST /api/entries:', error)
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

