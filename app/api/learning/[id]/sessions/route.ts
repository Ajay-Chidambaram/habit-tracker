
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { CreateSessionInput } from '@/types'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { data: item } = await supabase
      .from('learning_items')
      .select('id, completed_units, total_time_minutes')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!item) {
      return new NextResponse('Learning item not found', { status: 404 })
    }

    const body: CreateSessionInput = await request.json()

    // 1. Create Session
    const { data: session, error: sessionError } = await supabase
      .from('learning_sessions')
      .insert({
        learning_item_id: params.id,
        session_date: body.session_date || new Date().toISOString().split('T')[0],
        duration_minutes: body.duration_minutes || 0,
        units_completed: body.units_completed || 0,
        notes: body.notes
      })
      .select()
      .single()

    if (sessionError) {
      console.error('Error creating session:', sessionError)
      return new NextResponse('Error creating session', { status: 500 })
    }

    // 2. Update parent item totals
    const newCompletedUnits = (item.completed_units || 0) + (body.units_completed || 0)
    const newTotalTime = (item.total_time_minutes || 0) + (body.duration_minutes || 0)

    // Also set started_at if not set? Handled in PATCH usually, but maybe here too.
    // Let's just update the totals.

    const { error: updateError } = await supabase
      .from('learning_items')
      .update({
        completed_units: newCompletedUnits,
        total_time_minutes: newTotalTime,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)

    if (updateError) {
      console.error('Error updating parent item stats:', updateError)
      // Note: Session was created, but stats desynced. 
      // Ideally we'd rollback. 
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
