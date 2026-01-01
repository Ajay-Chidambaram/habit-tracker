
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

    const body = await request.json()
    const { date, duration_minutes, notes } = body

    if (!date) {
      return new NextResponse('Date is required', { status: 400 })
    }

    // Upsert completion
    // We strive for idempotency: if it exists, update it. If not, create it.
    // The UNIQUE constraint is on (habit_id, completed_date).

    const { data, error } = await supabase
      .from('habit_completions')
      .upsert({
        habit_id: params.id,
        completed_date: date, // YYYY-MM-DD
        duration_minutes,
        notes
      }, {
        onConflict: 'habit_id, completed_date'
      })
      .select()
      .single()

    if (error) {
      console.error('Error completing habit:', error)
      return new NextResponse('Error completing habit', { status: 500 })
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

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return new NextResponse('Date parameter is required', { status: 400 })
    }

    // Check ownership by ensuring the habit belongs to the user
    // RLS policies should handle this actually: 
    // "Users can manage completions for their habits" -> checks habit owner.

    const { error } = await supabase
      .from('habit_completions')
      .delete()
      .eq('habit_id', params.id)
      .eq('completed_date', date)

    if (error) {
      console.error('Error removing completion:', error)
      return new NextResponse('Error removing completion', { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
