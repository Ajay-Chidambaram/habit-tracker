
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { CreateBucketItemInput } from '@/types'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { data: items, error } = await supabase
      .from('bucket_list_items')
      .select('*')
      .eq('user_id', user.id)
      .order('is_completed', { ascending: true }) // Active first
      .order('priority', { ascending: true }) // High priority first (assuming enum order or custom logic, but priority is string usually. Let's rely on client sort if needed, but DB sort is good)
      // Actually priority is enum: 'high', 'medium', 'low' etc? Or 'this_year', 'soon', 'someday'.
      // If alphabetical, 'someday' > 'soon' > 'this_year'. Not ideal.
      // Let's just order by created_at for stable sort secondary to completion.
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bucket list:', error)
      return new NextResponse('Error fetching bucket list', { status: 500 })
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

    const body: CreateBucketItemInput = await request.json()

    if (!body.title) {
      return new NextResponse('Title is required', { status: 400 })
    }

    const { data: item, error } = await supabase
      .from('bucket_list_items')
      .insert({
        user_id: user.id,
        title: body.title,
        description: body.description,
        category: body.category || 'travel',
        priority: body.priority || 'someday',
        icon: body.icon || '🌟',
        is_completed: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating bucket item:', error)
      return new NextResponse('Error creating bucket item', { status: 500 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
