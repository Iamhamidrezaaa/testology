import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserReferrals } from '@/lib/referral'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'لطفاً وارد حساب کاربری خود شوید' },
        { status: 401 }
      )
    }

    const userId = req.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'شناسه کاربر الزامی است' },
        { status: 400 }
      )
    }

    // بررسی دسترسی
    if (session.user.id !== userId && !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'شما دسترسی به این اطلاعات را ندارید' },
        { status: 403 }
      )
    }

    const referrals = await getUserReferrals(userId)

    return NextResponse.json({
      success: true,
      referrals
    })
  } catch (error: any) {
    console.error('خطا در دریافت لیست ارجاع‌ها:', error)
    return NextResponse.json(
      { error: error.message || 'خطا در دریافت لیست ارجاع‌ها' },
      { status: 500 }
    )
  }
} 
