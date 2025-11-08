import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = params

    // Therapist and Patient models don't exist in schema
    // Returning error for now
    return NextResponse.json({ 
      error: 'Therapist feature not fully implemented',
      message: 'Therapist and Patient models are not in schema'
    }, { status: 400 })

  } catch (error) {
    console.error('Error fetching patient details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















