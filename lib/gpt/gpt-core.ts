import { OpenAIStream } from '@/lib/openai';

export async function gptSmartAnalyze(prompt: string): Promise<string> {
  try {
    const systemPrompt = `شما یک روانشناس مجازی متخصص هستید که به کاربران در مسیر رشد روانی کمک می‌کنید. پاسخ‌های شما باید:
- به فارسی و قابل فهم باشد
- انگیزشی و مثبت باشد
- عملی و قابل اجرا باشد
- کوتاه و مختصر باشد`;

    const stream = OpenAIStream(systemPrompt, prompt);
    let fullText = "";
    
    for await (const chunk of stream) {
      const text = new TextDecoder().decode(chunk);
      fullText += text;
    }
    
    return fullText.trim();
  } catch (error) {
    console.error("خطا در تحلیل GPT:", error);
    throw new Error("خطا در دریافت پاسخ از هوش مصنوعی");
  }
}




















