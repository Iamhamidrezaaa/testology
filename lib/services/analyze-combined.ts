import { getOpenAI } from '@/lib/openai'
import { TestResult } from '@prisma/client'

interface CombinedAnalysisResult {
  text: string
  moodScore: number
  recommendations: string[]
  riskLevel: 'low' | 'medium' | 'high'
}

export async function analyzeCombinedResults(
  recentTests: TestResult[], 
  currentTest: TestResult
): Promise<string> {
  try {
    // ساخت خلاصه تست‌ها
    const testSummary = recentTests.map(test => ({
      name: test.testName,
      score: test.score,
      date: new Date(test.createdAt).toLocaleDateString('fa-IR'),
      result: test.resultText?.substring(0, 200) + '...' || 'تحلیل در دسترس نیست'
    }))

    const currentTestInfo = {
      name: currentTest.testName,
      score: currentTest.score,
      result: currentTest.resultText?.substring(0, 200) + '...' || 'تحلیل در دسترس نیست'
    }

    const prompt = `
شما یک روانشناس متخصص هستید که نتایج تست‌های روانشناسی کاربر را تحلیل می‌کنید.

تست فعلی:
- نام: ${currentTestInfo.name}
- امتیاز: ${currentTestInfo.score || 'نامشخص'}
- تحلیل: ${currentTestInfo.result}

تاریخچه تست‌های اخیر:
${testSummary.map(test => `
- تست: ${test.name}
- امتیاز: ${test.score || 'نامشخص'}
- تاریخ: ${test.date}
- تحلیل: ${test.result}
`).join('\n')}

لطفاً تحلیل ترکیبی و مرحله‌ای ارائه دهید که شامل:

1. ارزیابی کلی وضعیت روان‌شناسی بر اساس تمام تست‌ها
2. روند تغییرات در طول زمان
3. نقاط قوت و ضعف شناسایی شده
4. توصیه‌های عملی برای بهبود
5. پیشنهاد تست‌های تکمیلی در صورت نیاز
6. هشدارهای احتمالی و نیاز به مراجعه به متخصص

تحلیل باید:
- به زبان فارسی و قابل فهم باشد
- مثبت و امیدوارکننده باشد
- عملی و قابل اجرا باشد
- حرفه‌ای و علمی باشد
- شامل راهکارهای عملی باشد
`

    const openai = getOpenAI();
    if (!openai) {
      return 'متأسفانه در حال حاضر قادر به تحلیل ترکیبی نیستیم. لطفاً کمی بعد دوباره تلاش کنید.';
    }

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
      max_tokens: 1500
    })

    return completion.choices[0]?.message?.content || 'تحلیل ترکیبی در دسترس نیست.'

  } catch (error) {
    console.error('Error in combined analysis:', error)
    return 'متأسفانه در حال حاضر قادر به تحلیل ترکیبی نیستیم. لطفاً کمی بعد دوباره تلاش کنید.'
  }
}

export async function calculateMoodScore(tests: TestResult[]): Promise<number> {
  if (tests.length === 0) return 50

  let totalScore = 0
  let validTests = 0

  tests.forEach(test => {
    if (test.score !== null) {
      let normalizedScore = 0
      
      switch (test.testSlug) {
        case 'rosenberg':
          normalizedScore = (test.score / 40) * 100
          break
        case 'swls':
          normalizedScore = (test.score / 35) * 100
          break
        case 'gad7':
          normalizedScore = Math.max(0, 100 - (test.score / 21) * 100)
          break
        case 'phq9':
          normalizedScore = Math.max(0, 100 - (test.score / 27) * 100)
          break
        case 'pss':
          normalizedScore = Math.max(0, 100 - (test.score / 40) * 100)
          break
        default:
          normalizedScore = test.score
      }
      
      totalScore += normalizedScore
      validTests++
    }
  })

  return validTests > 0 ? Math.round(totalScore / validTests) : 50
}

















