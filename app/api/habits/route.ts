
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { CreateHabitInput } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { data: habits, error } = await supabase
      .from('habits')
      .select(`
        *,
        completions:habit_completions(*)
      `)
      .eq('user_id', user.id)
      .eq('is_archived', false)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching habits:', error)
      return new NextResponse('Error fetching habits', { status: 500 })
    }

    return NextResponse.json(habits)
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

    const body: CreateHabitInput = await request.json()

    // Validate required fields
    if (!body.name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    const { data: habit, error } = await supabase
      .from('habits')
      .insert({
        user_id: user.id,
        name: body.name,
        description: body.description,
        icon: body.icon || '✓',
        color: body.color || '#4ade80',
        frequency_type: body.frequency_type || 'daily',
        frequency_value: body.frequency_value || [],
        category: body.category || 'personal',
        target_duration_minutes: body.target_duration_minutes,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating habit:', error)
      return new NextResponse('Error creating habit', { status: 500 })
    }

    return NextResponse.json(habit)
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
