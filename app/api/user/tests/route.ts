import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // دریافت تست‌های انجام شده توسط کاربر
  const userTestResults = await prisma.testResult.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  // دریافت تمام تست‌های موجود
  const availableTests = await prisma.test.findMany({
    where: { 
      isActive: true,
      deletedAt: null 
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ 
    userTestResults,
    availableTests,
    totalUserTests: userTestResults.length,
    totalAvailableTests: availableTests.length
  })
}

















