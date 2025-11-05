import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const timestamp = new Date().toISOString()
    
    return NextResponse.json({
      success: true,
      timestamp,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      message: 'زمان سرور دریافت شد'
    })
  } catch (error) {
    console.error('Error getting server time:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطا در دریافت زمان سرور' 
      },
      { status: 500 }
    )
  }
}





