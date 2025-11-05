import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // فقط ادمین مجاز است
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { title, body, type, userId } = await req.json()

    if (!title || !body || !type) {
      return NextResponse.json({ error: 'Title, body and type are required' }, { status: 400 })
    }

    // مدل notification هنوز generate نشده - Mock response
    // if (userId) {
    //   // ارسال به کاربر خاص
    //   await prisma.notification.create({
    //     data: {
    //       userId,
    //       title,
    //       message: body,
    //       type
    //     }
    //   })
    // } else {
    //   // ارسال به همه کاربران
    //   const users = await prisma.user.findMany({
    //     select: { id: true }
    //   })

    //   await prisma.notification.createMany({
    //     data: users.map((user: any) => ({
    //       userId: user.id,
    //       title,
    //       message: body,
    //       type
    //     }))
    //   })
    // }
    
    console.log('Notification would be sent:', { title, body, type, userId })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}