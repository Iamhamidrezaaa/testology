import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // TherapistAssignment model doesn't exist in schema
    const assignments: any[] = [];
    
    const stats = {
      total: 0,
      assigned: 0,
      inProgress: 0,
      completed: 0,
      skipped: 0,
      highPriority: 0,
      overdue: 0
    }

    const groupedAssignments = {
      assigned: [],
      inProgress: [],
      completed: [],
      skipped: []
    }

    return NextResponse.json({
      assignments,
      stats,
      groupedAssignments
    })

  } catch (error) {
    console.error('Error fetching user assignments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















