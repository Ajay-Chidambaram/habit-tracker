
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { CreateWishlistInput } from '@/types'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { data: items, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', user.id)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching wishlist:', error)
      return new NextResponse('Error fetching wishlist', { status: 500 })
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

    const body: CreateWishlistInput = await request.json()

    if (!body.name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    const { data: item, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: user.id,
        name: body.name,
        description: body.description,
        price: body.price,
        url: body.url,
        category: body.category || 'general',
        priority: body.priority || 1,
        status: 'researching'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating wishlist item:', error)
      return new NextResponse('Error creating wishlist item', { status: 500 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
