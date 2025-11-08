import { getOpenAI } from '@/lib/openai'

export type ChatCompletionRequestMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function OpenAIStream(messages: ChatCompletionRequestMessage[]): Promise<string> {
  try {
    const openai = getOpenAI();
    if (!openai) {
      throw new Error('OpenAI key not configured');
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'شما یک دستیار هوشمند روانشناسی هستید که به کاربران کمک می‌کنید.'
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    return completion.choices[0]?.message?.content || 'متأسفانه پاسخی دریافت نشد.'
  } catch (error) {
    console.error('Error in OpenAI API:', error)
    throw new Error('خطا در ارتباط با OpenAI')
  }
} 