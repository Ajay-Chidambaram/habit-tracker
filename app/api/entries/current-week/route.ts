import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getServerUser } from '@/lib/auth/helpers'
import { ApiResponse, EntryResponse } from '@/types/api'

/**
 * Helper function to get the Monday of the current week
 * Returns date in YYYY-MM-DD format
 */
function getCurrentWeekMonday(): string {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  const monday = new Date(today.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  
  const year = monday.getFullYear()
  const month = String(monday.getMonth() + 1).padStart(2, '0')
  const date = String(monday.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${date}`
}

/**
 * GET /api/entries/current-week
 * Get or create the current week's entry
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

    const weekStart = getCurrentWeekMonday()
    const supabase = await createClient()

    // Try to get existing entry
    const { data: existingEntry, error: fetchError } = await supabase
      .from('weekly_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start', weekStart)
      .single()

    let entryId: string

    if (existingEntry) {
      // Entry exists, use it
      entryId = existingEntry.id
    } else {
      // Create new entry for current week
      const { data: newEntry, error: createError } = await supabase
        .from('weekly_entries')
        .insert({
          user_id: user.id,
          week_start: weekStart,
        })
        .select()
        .single()

      if (createError || !newEntry) {
        console.error('Error creating current week entry:', createError)
        return NextResponse.json<ApiResponse<null>>(
          { error: 'Failed to create entry for current week' },
          { status: 500 }
        )
      }

      entryId = newEntry.id
    }

    // Get entry with all related items (reuse logic from [id] route)
    const { data: entry, error: entryError } = await supabase
      .from('weekly_entries')
      .select('*')
      .eq('id', entryId)
      .single()

    if (entryError || !entry) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Failed to fetch entry' },
        { status: 500 }
      )
    }

    // Get all related items
    const [habitsResult, projectsResult, purchasesResult, experiencesResult] =
      await Promise.all([
        supabase
          .from('habits')
          .select('*')
          .eq('entry_id', entryId)
          .order('order_index', { ascending: true }),
        supabase
          .from('side_projects')
          .select('*')
          .eq('entry_id', entryId)
          .order('order_index', { ascending: true }),
        supabase
          .from('purchases_research')
          .select('*')
          .eq('entry_id', entryId)
          .order('order_index', { ascending: true }),
        supabase
          .from('experiences_travel')
          .select('*')
          .eq('entry_id', entryId)
          .order('order_index', { ascending: true }),
      ])

    if (
      habitsResult.error ||
      projectsResult.error ||
      purchasesResult.error ||
      experiencesResult.error
    ) {
      console.error('Error fetching related items:', {
        habits: habitsResult.error,
        projects: projectsResult.error,
        purchases: purchasesResult.error,
        experiences: experiencesResult.error,
      })
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Failed to fetch entry items' },
        { status: 500 }
      )
    }

    const entryWithItems: EntryResponse['entry'] = {
      ...entry,
      habits: habitsResult.data || [],
      side_projects: projectsResult.data || [],
      purchases_research: purchasesResult.data || [],
      experiences_travel: experiencesResult.data || [],
    }

    return NextResponse.json<ApiResponse<EntryResponse>>({
      data: { entry: entryWithItems },
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/entries/current-week:', error)
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

