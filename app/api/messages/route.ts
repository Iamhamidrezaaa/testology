import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const withUserId = searchParams.get('with')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let whereClause: any = {
      OR: [
        { fromId: session.user.id },
        { toId: session.user.id }
      ]
    }

    // اگر با کاربر خاصی چت می‌کنیم
    if (withUserId) {
      whereClause = {
        OR: [
          {
            fromId: session.user.id,
            toId: withUserId
          },
          {
            fromId: withUserId,
            toId: session.user.id
          }
        ]
      }
    }

    const messages = await prisma.userMessage.findMany({
      where: whereClause,
      include: {
        from: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        to: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    // علامت‌گذاری پیام‌ها به عنوان خوانده شده
    if (withUserId) {
      await prisma.userMessage.updateMany({
        where: {
          fromId: withUserId,
          toId: session.user.id,
          isRead: false
        },
        data: { isRead: true }
      })
    }

    return NextResponse.json({ 
      messages: messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        from: msg.from,
        to: msg.to,
        createdAt: msg.createdAt,
        isRead: msg.isRead,
        fromMe: msg.fromId === session.user.id
      }))
    })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















