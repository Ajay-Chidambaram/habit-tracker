
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { CreateProjectInput } from '@/types'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return new NextResponse('Error fetching projects', { status: 500 })
    }

    return NextResponse.json(projects)
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

    const body: CreateProjectInput = await request.json()
    const bodyAny = body as any

    if (!body.name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: body.name,
        description: body.description,
        status: bodyAny.status || 'idea',
        color: body.color || '#3b82f6',
        icon: body.icon || '📁',
        goal_id: body.goal_id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return new NextResponse('Error creating project', { status: 500 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
