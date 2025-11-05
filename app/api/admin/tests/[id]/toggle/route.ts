import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // موقتاً authentication را غیرفعال می‌کنیم
    console.log('🚀 Toggling test status (authentication temporarily disabled)')

    const testId = params.id
    const { isActive } = await req.json()

    // Update test status using raw SQL
    await prisma.$executeRaw`
      UPDATE Test 
      SET isActive = ${isActive},
          updatedAt = datetime('now')
      WHERE id = ${testId}
    `

    return NextResponse.json({
      success: true,
      message: `تست ${isActive ? 'فعال' : 'غیرفعال'} شد`,
      data: { id: testId, isActive }
    })
  } catch (error) {
    console.error('Error toggling test status:', error)
    return NextResponse.json(
      { error: 'خطا در تغییر وضعیت تست' },
      { status: 500 }
    )
  }
}




