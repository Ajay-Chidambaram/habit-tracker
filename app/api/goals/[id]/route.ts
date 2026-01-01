
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { UpdateGoalInput } from '@/types'

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

    const { data: goal, error } = await supabase
      .from('goals')
      .select(`
        *,
        milestones:goal_milestones(*)
      `)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching goal:', error)
      return new NextResponse('Error fetching goal', { status: 500 })
    }

    // Sort milestones
    if (goal && goal.milestones) {
      goal.milestones.sort((a: any, b: any) => {
        if (a.is_completed === b.is_completed) {
          return (a.order_index || 0) - (b.order_index || 0)
        }
        return a.is_completed ? 1 : -1
      })
    }

    return NextResponse.json(goal)
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

    const body: UpdateGoalInput = await request.json()

    // If status is being set to completed, set completed_at
    // If set to active, clear completed_at
    const updates: any = { ...body }
    if (body.status === 'completed' && !body.completed_at) {
      updates.completed_at = new Date().toISOString().split('T')[0]
    } else if (body.status === 'active') {
      updates.completed_at = null
    }

    const { data: goal, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating goal:', error)
      return new NextResponse('Error updating goal', { status: 500 })
    }

    return NextResponse.json(goal)
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
      .from('goals')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting goal:', error)
      return new NextResponse('Error deleting goal', { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
