import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface ChatMessage {
  from: 'user' | 'bot'
  text: string
}

export async function chatWithPsychologist(messages: ChatMessage[]): Promise<string> {
  try {
    const formattedMessages = messages.map(m => ({
      role: m.from === 'user' ? 'user' : 'assistant',
      content: m.text
    }))

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `تو یک روان‌درمانگر حرفه‌ای و مهربان هستی. وظایف تو:
          1. گوش دادن فعال و همدلانه به مراجع
          2. پرسیدن سوالات مناسب برای درک بهتر مشکل
          3. ارائه راهنمایی‌های عملی و کاربردی
          4. حفظ حریم خصوصی و رازداری
          5. ارجاع به متخصص در صورت نیاز
          
          نکات مهم:
          - همیشه به فارسی پاسخ بده
          - از زبان ساده و قابل فهم استفاده کن
          - نسخه نپیچ و تشخیص نده
          - در صورت نیاز به مداخله فوری، به مراجع پیشنهاد مراجعه به روان‌شناس یا روانپزشک رو بده
          - از اصطلاحات تخصصی زیاد استفاده نکن
          - همدلی و حمایت عاطفی رو فراموش نکن`
        },
        ...(formattedMessages as any)
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    return response.choices[0]?.message?.content || 'متأسفانه در حال حاضر قادر به پاسخگویی نیستم.'
  } catch (error) {
    console.error('GPT API error:', error)
    throw new Error('خطا در ارتباط با سرویس هوش مصنوعی')
  }
} 