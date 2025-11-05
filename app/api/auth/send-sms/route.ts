import { NextResponse } from 'next/server'
import { sendVerificationSMS } from '@/lib/services/sms'

export async function POST(req: Request) {
  try {
    const { phone, code } = await req.json()

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, message: 'اطلاعات ناقص' },
        { status: 400 }
      )
    }

    const result = await sendVerificationSMS(phone, code)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'خطا در ارسال پیامک' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error sending SMS:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در ارسال پیامک' },
      { status: 500 }
    )
  }
} 
