import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOpenAIClient } from '@/lib/openai-client';


export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, testResult, combinedAnalysis } = await req.json()

    if (!message || !testResult) {
      return NextResponse.json({ error: 'Message and test result are required' }, { status: 400 })
    }

    // ساخت پرامپت برای روانشناس مجازی
    const systemPrompt = `
شما یک روانشناس متخصص و دلسوز هستید که به کاربران کمک می‌کنید. 

اطلاعات تست کاربر:
- نام تست: ${testResult.testName}
- امتیاز: ${testResult.score || 'نامشخص'}
- نوع تست: ${testResult.testId || 'unknown'}
- تحلیل: ${testResult.result || testResult.analysis || 'تحلیل در دسترس نیست'}

${combinedAnalysis ? `تحلیل ترکیبی: ${combinedAnalysis}` : ''}

لطفاً:
1. به سوالات کاربر با تخصص روانشناسی پاسخ دهید
2. از اطلاعات تست برای ارائه راهنمایی‌های شخصی‌سازی شده استفاده کنید
3. همدلانه و حمایت‌گر باشید
4. در صورت نیاز، پیشنهاد مراجعه به متخصص بدهید
5. به زبان فارسی و با لحن دوستانه پاسخ دهید
6. راهکارهای عملی ارائه دهید
`

    const openai = getOpenAIClient();
    if (!openai) {
      return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const reply = completion.choices[0]?.message?.content || 'متأسفانه در حال حاضر قادر به پاسخگویی نیستم.'

    return NextResponse.json({ reply })

  } catch (error) {
    console.error('Error in psychologist chatbot:', error)
    return NextResponse.json({ error: 'خطا در چت‌بات روانشناس' }, { status: 500 })
  }
}

















