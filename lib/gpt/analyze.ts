import OpenAI from 'openai'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface AnalyzeParams {
  message: string
  user: any // User type from Prisma
  testResults: any[] // TestResult type from Prisma
  practices: any[] // PracticeTracking type from Prisma
  history: any[] // ChatMessage type from Prisma
}

export async function analyzeMessageWithGPT({
  message,
  user,
  testResults,
  practices,
  history,
}: AnalyzeParams): Promise<string> {
  // ساخت سیستم پرامپت
  const systemPrompt = `شما یک دستیار هوشمند روانشناسی هستید که به کاربران در زمینه سلامت روان کمک می‌کنید.
اطلاعات کاربر:
- نام: ${user?.firstName || 'نامشخص'} ${user?.lastName || ''}
- سن: ${user?.age || 'نامشخص'}
- جنسیت: ${user?.gender || 'نامشخص'}

نتایج تست‌های اخیر:
${testResults
  .map(
    (test) =>
      `- ${test.testName}: نمره ${test.score || 'نامشخص'} (${new Date(
        test.createdAt
      ).toLocaleDateString('fa-IR')})`
  )
  .join('\n')}

وضعیت تمرین‌ها:
${practices
  .map(
    (practice) =>
      `- ${practice.practice.title}: ${practice.status} ${
        practice.feedback ? `(بازخورد: ${practice.feedback})` : ''
      }`
  )
  .join('\n')}

تاریخچه چت:
${history
  .map((msg) => `${msg.role === 'user' ? 'کاربر' : 'دستیار'}: ${msg.content}`)
  .join('\n')}

لطفاً با توجه به این اطلاعات، به پیام کاربر پاسخ دهید. پاسخ شما باید:
1. همدلانه و حمایت‌گر باشد
2. از اطلاعات تست‌ها و تمرین‌ها برای ارائه راهنمایی‌های شخصی‌سازی شده استفاده کند
3. در صورت نیاز، تمرین‌های جدید پیشنهاد دهد
4. به زبان فارسی و با لحن دوستانه پاسخ دهد`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return completion.choices[0]?.message?.content || 'متأسفانه در حال حاضر قادر به پاسخگویی نیستم.'
  } catch (error) {
    console.error('Error analyzing message with GPT:', error)
    return 'متأسفانه در حال حاضر قادر به پاسخگویی نیستم. لطفاً کمی بعد دوباره تلاش کنید.'
  }
} 