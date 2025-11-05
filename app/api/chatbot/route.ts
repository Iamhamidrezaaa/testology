import { NextRequest, NextResponse } from 'next/server'
import { chatWithPsychologist } from '@/lib/gpt/chatPsychologist'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages = body.messages || []

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'فرمت پیام‌ها نامعتبر است' },
        { status: 400 }
      )
    }

    const reply = await chatWithPsychologist(messages)
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { error: 'خطا در پردازش درخواست' },
      { status: 500 }
    )
  }
} 
