
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { CreateMilestoneInput } from '@/types'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Verify goal ownership first
    const { data: goal } = await supabase
      .from('goals')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!goal) {
      return new NextResponse('Goal not found or unauthorized', { status: 404 })
    }

    const body: CreateMilestoneInput = await request.json()

    if (!body.title) {
      return new NextResponse('Title is required', { status: 400 })
    }

    const { data: milestone, error } = await supabase
      .from('goal_milestones')
      .insert({
        goal_id: params.id,
        title: body.title,
        description: body.description,
        is_completed: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating milestone:', error)
      return new NextResponse('Error creating milestone', { status: 500 })
    }

    return NextResponse.json(milestone)
  } catch (error) {
    console.error('Internal Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } } // goal_id (not used directly here, but could be for verification)
) {
  // NOTE: This route is slightly tricky. The file path is `app/api/goals/[id]/milestones/route.ts`
  // Usually this would be for CREATING a milestone for a goal.
  // For UPDATING a milestone, we usually need the milestone ID.
  // Let's assume this endpoint handles BULK updates or specific milestone creation.

  // Actually, for updating a specific milestone, we might need `/api/goals/[goal_id]/milestones/[milestone_id]`
  // BUT, to keep things simple as per the plan, let's look at `route.ts`. 
  // If the user wants to toggle a milestone, they need to pass the milestone ID.

  // I will check if the user intended to have a separate route for milestone ID level operations.
  // The plan said: `app/api/goals/[id]/milestones/route.ts` - Likely for GET/POST.
  // Milestone toggling might need another route or be handled here with a query param or body param "id".

  // Let's support PATCH here for toggling if `id` is in the body, OR maybe we just stick to POST for creation.
  // Better approach: Let's create `app/api/goals/milestones/[id]/route.ts` separately if needed, 
  // OR just handle toggling in this route if we pass the milestone ID in the body?
  // No, that's not RESTful. 

  // Let's stick to POST for creation here.
  // I will create a separate route `app/api/milestones/[id]/route.ts` or similar if I can, OR just include it here if the plan dictates.

  // Plan check:
  // "Created app/api/goals/[id]/milestones/route.ts"
  // It does NOT explicitly say there is a `app/api/milestones` route.
  // However, `app/api/goals/[id]/route.ts` exists.

  // Let's implement PUT/PATCH here to handle "Update Milestone" if we pass ID?
  // Or better: Let's assume the component will call a new endpoint I'll make: `app/api/goals/milestones/[id]/route.ts`?
  // Wait, I can't easily make files outside the plan structure if I want to be strict, but I should be practical.

  // I'll make `app/api/goals/[id]/milestones/[milestoneId]/route.ts` if needed.
  // BUT easier: `app/api/milestones/[id]/route.ts`.
  // Let's just put the update logic in this file for now using a custom method or just stick to POST.

  return new NextResponse('Method Not Allowed', { status: 405 })
}
