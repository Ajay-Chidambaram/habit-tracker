
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { UpdateLearningInput } from '@/types'

export const dynamic = 'force-dynamic'

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

    const { data: item, error } = await supabase
      .from('learning_items')
      .select(`
        *,
        sessions:learning_sessions(*)
      `)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching learning item:', error)
      return new NextResponse('Error fetching learning item', { status: 500 })
    }

    // Sort sessions by date desc
    if (item.sessions) {
      item.sessions.sort((a: any, b: any) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime())
    }

    return NextResponse.json(item)
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

    const body: UpdateLearningInput = await request.json()

    const updates: any = { ...body }

    // If status changes to completed, set completed_at
    const bodyAny = body as any
    if (body.status === 'completed' && !bodyAny.completed_at) {
      updates.completed_at = new Date().toISOString().split('T')[0]
    }
    if (body.status === 'active' || body.status === 'not_started') {
      const { data: current } = await supabase.from('learning_items').select('status').eq('id', params.id).single()
      if (current?.status === 'completed') {
        updates.completed_at = null
      }
    }

    // If status is active and started_at is null, set it?
    if (body.status === 'active') {
      const { data: current } = await supabase.from('learning_items').select('started_at').eq('id', params.id).single()
      if (!current?.started_at) {
        updates.started_at = new Date().toISOString().split('T')[0]
      }
    }

    const { data: item, error } = await supabase
      .from('learning_items')
      .update(updates)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating learning item:', error)
      return new NextResponse('Error updating learning item', { status: 500 })
    }

    return NextResponse.json(item)
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
      .from('learning_items')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting learning item:', error)
      return new NextResponse('Error deleting learning item', { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
