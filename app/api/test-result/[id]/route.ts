import { NextRequest, NextResponse } from 'next/server'
import { getSessionWithFallback, validateSession } from '@/lib/session-utils'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionWithFallback()

    if (!validateSession(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const test = await prisma.testResult.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!test) {
      return NextResponse.json({ error: 'Test result not found' }, { status: 404 })
    }

    return NextResponse.json({ test })

  } catch (error) {
    console.error('Error fetching test result:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















