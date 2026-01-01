
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { CreateGoalInput } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { data: goals, error } = await supabase
      .from('goals')
      .select(`
        *,
        milestones:goal_milestones(*)
      `)
      .eq('user_id', user.id)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching goals:', error)
      return new NextResponse('Error fetching goals', { status: 500 })
    }

    return NextResponse.json(goals)
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

    const body: CreateGoalInput = await request.json()

    // Validate required fields
    if (!body.title) {
      return new NextResponse('Title is required', { status: 400 })
    }

    const { data: goal, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        title: body.title,
        description: body.description,
        target_date: body.target_date,
        color: body.color || '#3b82f6',
        icon: body.icon || '🎯',
        category: body.category || 'personal',
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating goal:', error)
      return new NextResponse('Error creating goal', { status: 500 })
    }

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
