
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Fetch all user data
    const [
      { data: habits },
      { data: completions },
      { data: goals },
      { data: milestones },
      { data: learning },
      { data: sessions },
      { data: bucket },
      { data: projects },
      { data: wishlist },
      { data: preferences }
    ] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', user.id),
      supabase.from('habit_completions').select('*, habits!inner(*)').eq('habits.user_id', user.id),
      supabase.from('goals').select('*').eq('user_id', user.id),
      supabase.from('goal_milestones').select('*, goals!inner(*)').eq('goals.user_id', user.id),
      supabase.from('learning_items').select('*').eq('user_id', user.id),
      supabase.from('learning_sessions').select('*, learning_items!inner(*)').eq('learning_items.user_id', user.id),
      supabase.from('bucket_list_items').select('*').eq('user_id', user.id),
      supabase.from('projects').select('*').eq('user_id', user.id),
      supabase.from('wishlist_items').select('*').eq('user_id', user.id),
      supabase.from('user_preferences').select('*').eq('user_id', user.id).single()
    ])

    const exportData = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email
      },
      data: {
        habits,
        completions,
        goals,
        milestones,
        learning,
        sessions,
        bucket,
        projects,
        wishlist,
        preferences
      }
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="life-os-export-${new Date().toISOString().split('T')[0]}.json"`
      }
    })
  } catch (error) {
    console.error('Export Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
