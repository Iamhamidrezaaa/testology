import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST: ایجاد درخواست تست برای کاربر توسط مشاور
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'THERAPIST') {
    return new Response(JSON.stringify({ error: 'دسترسی غیرمجاز' }), { status: 403 })
  }

  const { userId, testName, reason } = await request.json()
  if (!userId || !testName) {
    return new Response(JSON.stringify({ error: 'userId و testName الزامی هستند' }), { status: 400 })
  }

  // فقط برای کلاینت‌های خودش
  const isOwnClient = await prisma.user.count({ where: { id: userId, assignedTherapistId: session.user.id } })
  if (!isOwnClient) {
    return new Response(JSON.stringify({ error: 'این کاربر به شما اختصاص ندارد' }), { status: 403 })
  }

  const requestRow = await prisma.testRequest.create({
    data: { userId, testName, reason: reason ?? null, suggestedById: session.user.id }
  })

  return NextResponse.json({ request: requestRow })
}

// GET: لیست درخواست‌های تست برای کاربران یک مشاور
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'THERAPIST') {
    return new Response(JSON.stringify({ error: 'دسترسی غیرمجاز' }), { status: 403 })
  }

  // دریافت کاربرانی که به این درمانگر اختصاص دارند
  const assignedUsers = await prisma.user.findMany({
    where: { assignedTherapistId: session.user.id },
    select: { id: true }
  })
  
  const userIds = assignedUsers.map(u => u.id)
  
  const rows = await prisma.testRequest.findMany({
    where: { userId: { in: userIds } },
    orderBy: { createdAt: 'desc' }
  })
  
  // دریافت اطلاعات کاربران
  const rowsWithUsers = await Promise.all(
    rows.map(async (row) => {
      const user = await prisma.user.findUnique({
        where: { id: row.userId },
        select: { id: true, name: true, email: true }
      })
      return { ...row, user }
    })
  )

  return NextResponse.json({ requests: rowsWithUsers })
}


