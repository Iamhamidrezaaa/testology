import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface GPTResponse {
  keywords: string[]
}

export async function analyzeUserNeeds(screeningResults: any, chatbotSummary: string): Promise<GPTResponse> {
  const prompt = `بر اساس خلاصه زیر از وضعیت روانی فرد، تست‌های روانشناسی مناسب را پیشنهاد بده:

نتایج تست غربالگری:
${JSON.stringify(screeningResults, null, 2)}

خلاصه گفت‌وگو:
${chatbotSummary}

پیشنهاد ۳ تا ۵ تست مناسب با استفاده از برچسب‌هایی که به صورت لیست خروجی بده (فقط کلیدواژه‌های انگلیسی)

پاسخ در فرمت زیر بده:
{ "keywords": ["anxiety", "self-esteem", "coping"] }`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150
    })

    const response = completion.choices[0]?.message?.content
    if (!response) throw new Error('No response from GPT')

    return JSON.parse(response) as GPTResponse
  } catch (error) {
    console.error('Error in GPT analysis:', error)
    return { keywords: [] }
  }
} 