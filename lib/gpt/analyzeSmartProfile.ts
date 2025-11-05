import { ChatCompletionRequestMessage, OpenAIStream, OpenAIStreamPayload } from '@/lib/openai'
import { format } from 'date-fns-jalali'
import { TestResult, PracticeTracking, ChatSession } from '@/generated/prisma'

interface AnalyzeSmartProfileParams {
  user: {
    name: string
    birthDate: string
    gender: string
    city: string
  }
  testResults: TestResult[]
  practices: PracticeTracking[]
  chatSessions: (ChatSession & { messages: { content: string; role: string }[] })[]
}

interface GPTResponse {
  summary: string
  recommendedTests: string[]
  recommendedPractices: string[]
  criticalAlert: string | null
}

export async function analyzeSmartProfile({
  user,
  testResults,
  practices,
  chatSessions,
}: AnalyzeSmartProfileParams) {
  // خلاصه تست‌ها
  const testSummary = testResults
    .map(
      (test) =>
        `- ${(test as any).testName || 'تست'}: نمره ${test.score || 'نامشخص'} (${format(
          test.createdAt,
          'yyyy/MM/dd'
        )})`
    )
    .join('\n')

  // بازخوردهای تمرین‌ها
  const feedbacks = practices
    .map(
      (p) =>
        `تمرین ${p.practiceId}: ${p.status} ${
          p.feedback ? `- ${p.feedback}` : ''
        }`
    )
    .join('\n')

  // نمونه‌های چت
  const chatSamples = chatSessions
    .flatMap((session) =>
      session.messages
        .filter((msg) => msg.role === 'user')
        .map((msg) => ({
          content: msg.content,
          createdAt: session.createdAt,
        }))
    )
    .slice(-3)
    .map((c) => `🗣️ ${format(c.createdAt, 'yyyy/MM/dd')} → ${c.content}`)
    .join('\n')

  const prompt = `
سلام. شما یک روانشناس خبره هستید که با تحلیل داده‌های روان‌شناسی، تمرین‌ها و گفت‌وگوهای کاربر، یک گزارش جامع برای خودش تهیه می‌کنید. نام کاربر ${user.name}، جنسیت: ${user.gender}، شهر: ${user.city} و تاریخ تولد: ${user.birthDate} است.

اطلاعات تست‌ها:
${testSummary}

بازخوردها و تمرین‌ها:
${feedbacks || 'تمرینی ثبت نشده'}

آخرین مکالمات:
${chatSamples || 'هیچ مکالمه‌ای موجود نیست'}

بر اساس اطلاعات بالا:
1. وضعیت روانی فعلی کاربر را در یک پاراگراف توصیف کن.
2. اگر روند خاصی در خلق‌وخو یا تست‌ها مشاهده می‌کنی توضیح بده.
3. اگر تمرینی مفید بوده، تأکید کن.
4. اگر هشدار روان‌شناختی مهمی هست یا نیاز فوری به مراجعه به درمانگر هست، اعلام کن.
5. برای ادامه مسیرش یک توصیه یا تمرین بده.

خروجی را دقیقاً در قالب زیر بده:
{
  "summary": "تحلیل کلی وضعیت روانی...",
  "recommendedTests": ["تست اضطراب", "تست افسردگی", ...],
  "recommendedPractices": ["تمرین تنفس عمیق", "مدیتیشن روزانه", ...],
  "criticalAlert": "هشدار مهم در صورت نیاز" یا null
}

حتماً با لحن حرفه‌ای ولی صمیمی بنویس.`

  const messages: ChatCompletionRequestMessage[] = [
    {
      role: 'system',
      content: 'شما یک روانشناس خبره با ۳۰ سال تجربه هستید.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ]

  const payload: OpenAIStreamPayload = {
    model: 'gpt-4',
    messages,
    temperature: 0.7,
    stream: false,
  }

  const systemPrompt = `شما یک متخصص روان‌شناسی هستید که پروفایل هوشمند کاربران را تحلیل می‌کنید.`;
  const userMessage = `لطفاً این پروفایل را تحلیل کنید: ${JSON.stringify({
    user,
    testResults,
    practices,
    chatSessions
  })}`;
  
  const stream = OpenAIStream(systemPrompt, userMessage);
  let fullText = "";
  
  for await (const chunk of stream) {
    const text = new TextDecoder().decode(chunk);
    fullText += text;
  }
  
  const content = fullText;

  if (!content) {
    throw new Error('پاسخ خالی از GPT دریافت شد')
  }

  const result = JSON.parse(content) as GPTResponse

  // محاسبه روند مود از نتایج تست‌ها
  const moodTrend = testResults
    .filter((test) => (test as any).testName === 'SCS')
    .map((test) => {
      const score = test.score || 0
      return Math.min(Math.max((score / 100) * 100, 0), 100)
    })
    .reverse()

  // محاسبه آمار تمرین‌ها
  const completedPractices = practices.filter((p) => p.status === 'DONE').length
  const totalPractices = practices.length

  // استخراج ریسک‌های احتمالی از تحلیل GPT
  const flaggedRisks = result.summary
    .split('\n')
    .filter((line: string) => line.includes('ریسک') || line.includes('هشدار'))
    .map((line: string) => line.replace(/^[-*]\s*/, '').trim())

  return {
    moodTrend,
    completedPractices,
    totalPractices,
    flaggedRisks,
    summary: result.summary,
    recommendedTests: result.recommendedTests,
    recommendedPractices: result.recommendedPractices,
    criticalAlert: result.criticalAlert,
  }
} 