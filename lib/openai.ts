import OpenAI from 'openai'
import { ChatCompletion, ChatCompletionChunk } from 'openai/resources/chat/completions'

export interface ChatCompletionRequestMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenAIStreamPayload {
  model: string
  messages: ChatCompletionRequestMessage[]
  temperature?: number
  stream?: boolean
}

export interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function* OpenAIStream(systemPrompt: string, userMessage: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let buffer = "";
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || "";
      buffer += content;

      // ارسال داده‌ها به صورت استریم
      if (buffer.length > 0) {
        yield encoder.encode(buffer);
        buffer = "";
      }
    }
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to get response from OpenAI");
  }
}

export async function generateTestQuestions(
  testType: string,
  count: number = 10
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `شما یک متخصص روان‌شناسی هستید که سوالات تست ${testType} را طراحی می‌کنید.
لطفاً ${count} سوال طراحی کنید که:
1. معتبر و استاندارد باشند
2. به زبان فارسی و واضح باشند
3. گزینه‌های مناسب داشته باشند
4. با فرمت JSON برگردانده شوند`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI Test Generation Error:", error);
    throw new Error("Failed to generate test questions");
  }
}

export async function analyzeTestResults(
  testType: string,
  answers: Record<string, string>
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `شما یک متخصص روان‌شناسی هستید که نتایج تست ${testType} را تحلیل می‌کنید.
لطفاً پاسخ‌های کاربر را تحلیل کنید و:
1. امتیاز کلی را محاسبه کنید
2. نقاط قوت و ضعف را مشخص کنید
3. پیشنهادات عملی ارائه دهید
4. با فرمت JSON برگردانید`,
        },
        {
          role: "user",
          content: JSON.stringify(answers),
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI Test Analysis Error:", error);
    throw new Error("Failed to analyze test results");
  }
}

export async function generateExercisePlan(
  testResults: Record<string, any>,
  goals: string[]
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `شما یک متخصص رشد شخصی هستید که برنامه تمرینات را بر اساس نتایج تست و اهداف کاربر طراحی می‌کنید.
لطفاً یک برنامه تمرینات طراحی کنید که:
1. متناسب با نتایج تست باشد
2. به اهداف کاربر کمک کند
3. عملی و قابل اجرا باشد
4. با فرمت JSON برگردانده شود`,
        },
        {
          role: "user",
          content: JSON.stringify({ testResults, goals }),
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI Exercise Plan Generation Error:", error);
    throw new Error("Failed to generate exercise plan");
  }
} 