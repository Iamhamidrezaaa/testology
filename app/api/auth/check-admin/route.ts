import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ isAdmin: false }, { status: 200 })
    }

    // بررسی نقش کاربر
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    })

    const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN' || session.user.email === 'h.asgarizade@gmail.com'

    return NextResponse.json({ isAdmin })

  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({ isAdmin: false }, { status: 200 })
  }
}

