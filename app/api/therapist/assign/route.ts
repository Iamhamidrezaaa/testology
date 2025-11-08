import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Therapist model doesn't exist in schema
    // Check role instead
    if (session.user.role !== 'THERAPIST' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied. Therapist role required.' }, { status: 403 })
    }
    
    const therapist = { id: session.user.id } // Mock therapist object

    const {
      userId,
      contentId,
      message,
      priority,
      dueDate
    } = await req.json()

    if (!userId || !contentId) {
      return NextResponse.json({ error: 'userId and contentId are required' }, { status: 400 })
    }

    // Patient model doesn't exist in schema - skip validation for now

    // بررسی اینکه محتوا وجود دارد
    const content = await prisma.marketplaceItem.findUnique({
      where: { id: contentId }
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // TherapistAssignment model doesn't exist in schema
    return NextResponse.json({ 
      success: false, 
      error: 'Assignment feature not implemented',
      message: 'TherapistAssignment model is not in schema'
    }, { status: 400 })

  } catch (error) {
    console.error('Error creating therapist assignment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}