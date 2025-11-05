import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { useReferralCode } from '@/lib/referral'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'لطفاً وارد حساب کاربری خود شوید' },
        { status: 401 }
      )
    }

    const { code } = await req.json()

    if (!code) {
      return NextResponse.json(
        { error: 'کد ارجاع الزامی است' },
        { status: 400 }
      )
    }

    const referral = await useReferralCode(session.user.id, code)

    return NextResponse.json({
      success: true,
      message: 'کد ارجاع با موفقیت ثبت شد',
      referral
    })
  } catch (error: any) {
    console.error('خطا در ثبت کد ارجاع:', error)
    return NextResponse.json(
      { error: error.message || 'خطا در ثبت کد ارجاع' },
      { status: 400 }
    )
  }
} 
