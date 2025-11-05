import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { userId, category, score, source } = await req.json()
    
    if (!userId || !category || score === undefined) {
      return NextResponse.json(
        { success: false, message: 'تمام فیلدها الزامی است' },
        { status: 400 }
      )
    }

    // پیدا کردن کاربر
    const user = await prisma.user.findUnique({
      where: { email: userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      )
    }

    // ایجاد رکورد جدید در MoodAggregate
    const moodRecord = await prisma.moodAggregate.create({
      data: {
        moodType: category,
        intensity: score / 10, // تبدیل از 0-100 به 0-10
        userCount: 1,
        recordedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'داده با موفقیت اضافه شد',
      data: {
        id: moodRecord.id,
        category: category,
        score: score,
        createdAt: moodRecord.recordedAt
      }
    })
    
  } catch (error) {
    console.error('Error updating mood trend:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در افزودن داده' },
      { status: 500 }
    )
  }
}