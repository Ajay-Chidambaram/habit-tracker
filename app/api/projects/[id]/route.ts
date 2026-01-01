
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { UpdateProjectInput } from '@/types'

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

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      return new NextResponse('Error fetching project', { status: 500 })
    }

    return NextResponse.json(project)
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

    const body: UpdateProjectInput = await request.json()

    const { data: project, error } = await supabase
      .from('projects')
      .update(body)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      return new NextResponse('Error updating project', { status: 500 })
    }

    return NextResponse.json(project)
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
      .from('projects')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting project:', error)
      return new NextResponse('Error deleting project', { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
