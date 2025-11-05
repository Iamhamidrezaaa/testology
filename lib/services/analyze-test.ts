import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface AnalyzeTestParams {
  testSlug: string
  answers: any[]
}

export async function analyzeTestWithGPT({ testSlug, answers }: AnalyzeTestParams) {
  try {
    // محاسبه امتیاز
    const score = calculateScore(testSlug, answers)
    
    // ساخت پرامپت برای تحلیل
    const prompt = buildAnalysisPrompt(testSlug, score, answers)
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'شما یک روانشناس متخصص هستید که نتایج تست‌های روانشناسی را تحلیل می‌کنید.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const resultText = completion.choices[0]?.message?.content || 'تحلیل در دسترس نیست.'

    return {
      score,
      resultText
    }
  } catch (error) {
    console.error('Error analyzing test with GPT:', error)
    throw new Error('خطا در تحلیل تست')
  }
}

function calculateScore(testSlug: string, answers: any[]): number {
  // محاسبه امتیاز بر اساس نوع تست
  switch (testSlug) {
    case 'rosenberg':
      return calculateRosenbergScore(answers)
    case 'swls':
      return calculateSwlsScore(answers)
    case 'gad7':
      return calculateGad7Score(answers)
    case 'phq9':
      return calculatePhq9Score(answers)
    case 'pss':
      return calculatePssScore(answers)
    default:
      return answers.reduce((sum, answer) => sum + (answer || 0), 0)
  }
}

function calculateRosenbergScore(answers: any[]): number {
  // محاسبه امتیاز Rosenberg (1-4 scale)
  return answers.reduce((sum, answer) => sum + (answer || 0), 0)
}

function calculateSwlsScore(answers: any[]): number {
  // محاسبه امتیاز SWLS (1-7 scale)
  return answers.reduce((sum, answer) => sum + (answer || 0), 0)
}

function calculateGad7Score(answers: any[]): number {
  // محاسبه امتیاز GAD-7 (0-3 scale)
  return answers.reduce((sum, answer) => sum + (answer || 0), 0)
}

function calculatePhq9Score(answers: any[]): number {
  // محاسبه امتیاز PHQ-9 (0-3 scale)
  return answers.reduce((sum, answer) => sum + (answer || 0), 0)
}

function calculatePssScore(answers: any[]): number {
  // محاسبه امتیاز PSS (0-4 scale)
  return answers.reduce((sum, answer) => sum + (answer || 0), 0)
}

function buildAnalysisPrompt(testSlug: string, score: number, answers: any[]): string {
  const testInfo = getTestInfo(testSlug)
  
  return `
تست: ${testInfo.name}
امتیاز: ${score} از ${testInfo.maxScore}
پاسخ‌ها: ${JSON.stringify(answers)}

لطفاً تحلیل کاملی از نتایج این تست ارائه دهید که شامل:
1. تفسیر امتیاز و سطح شدت
2. نقاط قوت و ضعف شناسایی شده
3. توصیه‌های عملی برای بهبود
4. پیشنهاد تست‌های تکمیلی در صورت نیاز

تحلیل باید به زبان فارسی و قابل فهم برای عموم باشد.
  `
}

function getTestInfo(testSlug: string) {
  const testInfoMap: Record<string, { name: string; maxScore: number }> = {
    'rosenberg': { name: 'تست عزت نفس روزنبرگ', maxScore: 40 },
    'swls': { name: 'تست رضایت از زندگی', maxScore: 35 },
    'gad7': { name: 'تست اضطراب GAD-7', maxScore: 21 },
    'phq9': { name: 'تست افسردگی PHQ-9', maxScore: 27 },
    'pss': { name: 'تست استرس ادراک‌شده', maxScore: 40 },
    'asrs': { name: 'تست ADHD', maxScore: 72 },
    'psqi': { name: 'تست کیفیت خواب', maxScore: 21 },
    'scs': { name: 'تست خوددلسوزی', maxScore: 130 },
    'cd-risc': { name: 'تست تاب‌آوری', maxScore: 100 },
    'ders': { name: 'تست تنظیم هیجان', maxScore: 160 }
  }
  
  return testInfoMap[testSlug] || { name: 'تست روانشناسی', maxScore: 100 }
}

















