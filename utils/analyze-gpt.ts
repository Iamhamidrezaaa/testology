import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface AnalyzeParams {
  testName: string
  answers: Record<string, string>
  context: string
}

interface GPTAnalysis {
  recommendations?: Array<{
    title: string
    description: string
    link: string
    type: 'test' | 'exercise' | 'referral' | 'analysis'
  }>
  [key: string]: any
}

export async function analyzeWithGPT({
  testName,
  answers,
  context,
}: {
  testName: string
  answers: Record<string, string>
  context: string
}): Promise<GPTAnalysis> {
  const prompt = `پاسخ‌های کاربر به تست ${testName}:\n${JSON.stringify(answers)}\n${context}`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'شما یک روان‌شناس هوشمند هستید که باید پاسخ‌های کاربر را تحلیل کنید و پیشنهادات مناسب ارائه دهید.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const analysis = data.choices[0].message.content

    try {
      return JSON.parse(analysis) as GPTAnalysis
    } catch (error) {
      console.error('Error parsing GPT response:', error)
      return {}
    }
  } catch (error) {
    console.error('Error calling GPT API:', error)
    return {}
  }
} 
