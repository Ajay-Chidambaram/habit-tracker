import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { SaveWeeklyReviewInput } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const weekStart = searchParams.get('week_start')

    if (!weekStart) {
      return new NextResponse('week_start is required', { status: 400 })
    }

    const { data: review, error } = await supabase
      .from('weekly_reviews')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start', weekStart)
      .maybeSingle()

    if (error) {
      console.error('Error fetching weekly review:', error)
      return new NextResponse('Error fetching weekly review', { status: 500 })
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body: SaveWeeklyReviewInput = await request.json()

    if (!body.week_start) {
      return new NextResponse('week_start is required', { status: 400 })
    }

    const { data: review, error } = await supabase
      .from('weekly_reviews')
      .upsert(
        {
          user_id: user.id,
          week_start: body.week_start,
          what_went_well: body.what_went_well ?? '',
          what_to_improve: body.what_to_improve ?? '',
          next_week_intention: body.next_week_intention ?? '',
          week_rating: body.week_rating,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,week_start' }
      )
      .select()
      .single()

    if (error) {
      console.error('Error saving weekly review:', error)
      return new NextResponse('Error saving weekly review', { status: 500 })
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
