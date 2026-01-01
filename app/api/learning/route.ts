
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { CreateLearningInput } from '@/types'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { data: items, error } = await supabase
      .from('learning_items')
      .select(`
        *,
        sessions:learning_sessions(*)
      `)
      .eq('user_id', user.id)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching learning items:', error)
      return new NextResponse('Error fetching learning items', { status: 500 })
    }

    return NextResponse.json(items)
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

    const body: CreateLearningInput = await request.json()

    if (!body.title) {
      return new NextResponse('Title is required', { status: 400 })
    }

    const { data: item, error } = await supabase
      .from('learning_items')
      .insert({
        user_id: user.id,
        title: body.title,
        description: body.description,
        type: body.type || 'skill',
        total_units: body.total_units || 100,
        unit_name: body.unit_name || 'percent',
        status: 'not_started', // Default status
        url: body.url,
        color: body.color || '#8b5cf6',
        icon: body.icon || '📚',
        total_time_minutes: 0,
        completed_units: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating learning item:', error)
      return new NextResponse('Error creating learning item', { status: 500 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
