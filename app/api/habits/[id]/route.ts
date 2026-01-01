
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { UpdateHabitInput } from '@/types'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { data: habit, error } = await supabase
      .from('habits')
      .select(`
        *,
        completions:habit_completions(*)
      `)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching habit:', error)
      return new NextResponse('Error fetching habit', { status: 500 })
    }

    return NextResponse.json(habit)
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body: UpdateHabitInput = await request.json()

    const { data: habit, error } = await supabase
      .from('habits')
      .update(body)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating habit:', error)
      return new NextResponse('Error updating habit', { status: 500 })
    }

    return NextResponse.json(habit)
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Determine if we should hard delete or soft delete (archive)
    // The schema has is_archived. 
    // Usually DELETE verb means delete, but here let's actually delete.
    // If client wants to archive, they should use PATCH { is_archived: true }

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting habit:', error)
      return new NextResponse('Error deleting habit', { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
