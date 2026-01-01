
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { UpdateBucketItemInput } from '@/types'

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
      .from('bucket_list_items')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching bucket item:', error)
      return new NextResponse('Error fetching bucket item', { status: 500 })
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

    const body: UpdateBucketItemInput = await request.json()
    const updates: any = { ...body }

    // Logic for completion
    if (typeof body.is_completed === 'boolean') {
      if (body.is_completed) {
        const updatesAny = updates as any
        if (!updatesAny.completed_at) {
          updates.completed_at = new Date().toISOString()
        }
      } else {
        updates.completed_at = null
        updates.completion_notes = null
      }
    }

    const { data: item, error } = await supabase
      .from('bucket_list_items')
      .update(updates)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating bucket item:', error)
      return new NextResponse('Error updating bucket item', { status: 500 })
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
      .from('bucket_list_items')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting bucket item:', error)
      return new NextResponse('Error deleting bucket item', { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
