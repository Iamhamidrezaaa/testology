import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tests } = await req.json()

    if (!tests || !Array.isArray(tests)) {
      return NextResponse.json({ error: 'Invalid tests data' }, { status: 400 })
    }

    // ساخت پرامپت برای تحلیل کلی
    const testSummary = tests.map(test => ({
      name: test.testName,
      score: test.score,
      date: new Date(test.createdAt).toLocaleDateString('fa-IR'),
      result: test.resultText?.substring(0, 200) + '...' || 'تحلیل در دسترس نیست'
    }))

    const prompt = `
شما یک روانشناس متخصص هستید که نتایج تست‌های روانشناسی کاربر را تحلیل می‌کنید.

نتایج تست‌های کاربر:
${testSummary.map(test => `
- تست: ${test.name}
- امتیاز: ${test.score || 'نامشخص'}
- تاریخ: ${test.date}
- تحلیل: ${test.result}
`).join('\n')}

لطفاً تحلیل کلی و جامعی از وضعیت روان‌شناسی این کاربر ارائه دهید که شامل:

1. ارزیابی کلی وضعیت روان‌شناسی
2. نقاط قوت و ضعف شناسایی شده
3. روند تغییرات در طول زمان
4. توصیه‌های عملی برای بهبود
5. پیشنهاد تست‌های تکمیلی در صورت نیاز

تحلیل باید:
- به زبان فارسی و قابل فهم باشد
- مثبت و امیدوارکننده باشد
- عملی و قابل اجرا باشد
- حرفه‌ای و علمی باشد
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'شما یک روانشناس متخصص و دلسوز هستید که به کاربران کمک می‌کنید تا وضعیت روان‌شناسی خود را بهتر درک کنند.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const analysis = completion.choices[0]?.message?.content || 'تحلیل در دسترس نیست.'

    return NextResponse.json({ analysis })

  } catch (error) {
    console.error('Error analyzing mental health:', error)
    return NextResponse.json({ error: 'خطا در تحلیل وضعیت روان‌شناسی' }, { status: 500 })
  }
}

















