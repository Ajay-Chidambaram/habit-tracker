
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { data: preferences, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching preferences:', error)
      return new NextResponse('Error fetching preferences', { status: 500 })
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()

    const { data: preferences, error } = await supabase
      .from('user_preferences')
      .update({
        theme: body.theme,
        week_starts_on: body.week_starts_on,
        notifications_enabled: body.notifications_enabled,
        reminder_time: body.reminder_time,
        dashboard_layout: body.dashboard_layout,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating preferences:', error)
      return new NextResponse('Error updating preferences', { status: 500 })
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
