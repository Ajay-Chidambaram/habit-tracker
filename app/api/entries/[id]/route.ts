import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getServerUser } from '@/lib/auth/helpers'
import { ApiResponse, EntryResponse, UpdateEntryRequest } from '@/types/api'

/**
 * GET /api/entries/[id]
 * Get a specific weekly entry with all related items
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const supabase = await createClient()

    // Get the entry
    const { data: entry, error: entryError } = await supabase
      .from('weekly_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (entryError || !entry) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Entry not found' },
        { status: 404 }
      )
    }

    // Get all related items
    const [habitsResult, projectsResult, purchasesResult, experiencesResult] =
      await Promise.all([
        supabase
          .from('habits')
          .select('*')
          .eq('entry_id', id)
          .order('order_index', { ascending: true }),
        supabase
          .from('side_projects')
          .select('*')
          .eq('entry_id', id)
          .order('order_index', { ascending: true }),
        supabase
          .from('purchases_research')
          .select('*')
          .eq('entry_id', id)
          .order('order_index', { ascending: true }),
        supabase
          .from('experiences_travel')
          .select('*')
          .eq('entry_id', id)
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
    console.error('Unexpected error in GET /api/entries/[id]:', error)
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/entries/[id]
 * Update a weekly entry and its related items
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body: UpdateEntryRequest = await request.json()
    const supabase = await createClient()

    // Verify entry exists and belongs to user
    const { data: existingEntry, error: checkError } = await supabase
      .from('weekly_entries')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingEntry) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Entry not found' },
        { status: 404 }
      )
    }

    // Update entry if week_start is provided
    if (body.week_start) {
      // Validate week_start
      if (!/^\d{4}-\d{2}-\d{2}$/.test(body.week_start)) {
        return NextResponse.json<ApiResponse<null>>(
          { error: 'Invalid week_start format. Expected YYYY-MM-DD' },
          { status: 400 }
        )
      }

      const { error: updateError } = await supabase
        .from('weekly_entries')
        .update({ week_start: body.week_start })
        .eq('id', id)

      if (updateError) {
        console.error('Error updating entry:', updateError)
        return NextResponse.json<ApiResponse<null>>(
          { error: 'Failed to update entry' },
          { status: 500 }
        )
      }
    }

    // Update related items if provided
    if (body.habits !== undefined) {
      // Delete existing habits
      await supabase.from('habits').delete().eq('entry_id', id)

      // Insert new habits (ensure required fields are present)
      if (body.habits.length > 0) {
        const habitsToInsert = body.habits.map((habit) => {
          const { id: _, ...habitWithoutId } = habit
          return {
            entry_id: id,
            name: habit.name || '',
            target_frequency: habit.target_frequency ?? 1,
            completed_count: habit.completed_count ?? 0,
            notes: habit.notes ?? null,
            order_index: habit.order_index ?? 0,
          }
        })
        const { error: habitsError } = await supabase
          .from('habits')
          .insert(habitsToInsert)

        if (habitsError) {
          console.error('Error updating habits:', habitsError)
          return NextResponse.json<ApiResponse<null>>(
            { error: 'Failed to update habits' },
            { status: 500 }
          )
        }
      }
    }

    if (body.side_projects !== undefined) {
      await supabase.from('side_projects').delete().eq('entry_id', id)
      if (body.side_projects.length > 0) {
        const projectsToInsert = body.side_projects.map((project) => {
          const { id: _, ...projectWithoutId } = project
          return {
            entry_id: id,
            name: project.name || '',
            goal: project.goal ?? null,
            status: project.status ?? 'not_started',
            notes: project.notes ?? null,
            order_index: project.order_index ?? 0,
          }
        })
        const { error: projectsError } = await supabase
          .from('side_projects')
          .insert(projectsToInsert)

        if (projectsError) {
          console.error('Error updating projects:', projectsError)
          return NextResponse.json<ApiResponse<null>>(
            { error: 'Failed to update projects' },
            { status: 500 }
          )
        }
      }
    }

    if (body.purchases_research !== undefined) {
      await supabase.from('purchases_research').delete().eq('entry_id', id)
      if (body.purchases_research.length > 0) {
        const purchasesToInsert = body.purchases_research.map((purchase) => {
          const { id: _, ...purchaseWithoutId } = purchase
          return {
            entry_id: id,
            item_name: purchase.item_name || '',
            category: purchase.category ?? 'purchase',
            priority: purchase.priority ?? 'medium',
            status: purchase.status ?? 'researching',
            notes: purchase.notes ?? null,
            order_index: purchase.order_index ?? 0,
          }
        })
        const { error: purchasesError } = await supabase
          .from('purchases_research')
          .insert(purchasesToInsert)

        if (purchasesError) {
          console.error('Error updating purchases:', purchasesError)
          return NextResponse.json<ApiResponse<null>>(
            { error: 'Failed to update purchases' },
            { status: 500 }
          )
        }
      }
    }

    if (body.experiences_travel !== undefined) {
      await supabase.from('experiences_travel').delete().eq('entry_id', id)
      if (body.experiences_travel.length > 0) {
        const experiencesToInsert = body.experiences_travel.map((exp) => {
          const { id: _, ...expWithoutId } = exp
          return {
            entry_id: id,
            title: exp.title || '',
            planned_date: exp.planned_date ?? null,
            type: exp.type ?? 'experience',
            status: exp.status ?? 'planning',
            notes: exp.notes ?? null,
            order_index: exp.order_index ?? 0,
          }
        })
        const { error: experiencesError } = await supabase
          .from('experiences_travel')
          .insert(experiencesToInsert)

        if (experiencesError) {
          console.error('Error updating experiences:', experiencesError)
          return NextResponse.json<ApiResponse<null>>(
            { error: 'Failed to update experiences' },
            { status: 500 }
          )
        }
      }
    }

    // Fetch and return updated entry with all items
    const { data: entry, error: entryError } = await supabase
      .from('weekly_entries')
      .select('*')
      .eq('id', id)
      .single()

    if (entryError || !entry) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Failed to fetch updated entry' },
        { status: 500 }
      )
    }

    // Get all related items
    const [habitsResult, projectsResult, purchasesResult, experiencesResult] =
      await Promise.all([
        supabase
          .from('habits')
          .select('*')
          .eq('entry_id', id)
          .order('order_index', { ascending: true }),
        supabase
          .from('side_projects')
          .select('*')
          .eq('entry_id', id)
          .order('order_index', { ascending: true }),
        supabase
          .from('purchases_research')
          .select('*')
          .eq('entry_id', id)
          .order('order_index', { ascending: true }),
        supabase
          .from('experiences_travel')
          .select('*')
          .eq('entry_id', id)
          .order('order_index', { ascending: true }),
      ])

    if (
      habitsResult.error ||
      projectsResult.error ||
      purchasesResult.error ||
      experiencesResult.error
    ) {
      console.error('Error fetching related items after update:', {
        habits: habitsResult.error,
        projects: projectsResult.error,
        purchases: purchasesResult.error,
        experiences: experiencesResult.error,
      })
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Failed to fetch updated entry items' },
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
    console.error('Unexpected error in PUT /api/entries/[id]:', error)
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/entries/[id]
 * Delete a weekly entry and all its related items (cascade)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const supabase = await createClient()

    // Verify entry exists and belongs to user
    const { data: existingEntry, error: checkError } = await supabase
      .from('weekly_entries')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingEntry) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Entry not found' },
        { status: 404 }
      )
    }

    // Delete entry (cascade will delete all related items)
    const { error: deleteError } = await supabase
      .from('weekly_entries')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting entry:', deleteError)
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Failed to delete entry' },
        { status: 500 }
      )
    }

    return NextResponse.json<ApiResponse<{ message: string }>>({
      data: { message: 'Entry deleted successfully' },
    })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/entries/[id]:', error)
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

