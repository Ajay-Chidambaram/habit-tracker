
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } } // This is milestone ID now
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // We need to ensure the milestone belongs to a goal owned by the user.
    // The RLS policy "Users can manage milestones for their goals" handles this!
    // So we can just update directly if RLS is set up correct.

    // Check RLS in 002_life_os_schema.sql:
    // USING ( EXISTS ( SELECT 1 FROM public.goals WHERE goals.id = goal_milestones.goal_id AND goals.user_id = auth.uid() ) )
    // Perfect.

    const body = await request.json()
    const { is_completed, title, description } = body

    const updates: any = {}
    if (typeof is_completed === 'boolean') {
      updates.is_completed = is_completed
      updates.completed_at = is_completed ? new Date().toISOString() : null
    }
    if (title) updates.title = title
    if (description !== undefined) updates.description = description

    const { data, error } = await supabase
      .from('goal_milestones')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating milestone:', error)
      return new NextResponse('Error updating milestone', { status: 500 })
    }

    return NextResponse.json(data)
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

    const { error } = await supabase
      .from('goal_milestones')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting milestone:', error)
      return new NextResponse('Error deleting milestone', { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
