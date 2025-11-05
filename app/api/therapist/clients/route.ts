import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'therapist') {
    return new Response(JSON.stringify({ error: 'دسترسی غیرمجاز' }), { status: 403 })
  }

  const therapistId = session.user.id
  const clients = await prisma.user.findMany({
    where: { assignedTherapistId: therapistId },
    select: { id: true, name: true, email: true, phone: true }
  })
  return NextResponse.json({ clients })
}























