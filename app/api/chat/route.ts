import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai-client';




export async function POST(req: NextRequest) {
  try {
    const { message, testResults, history, isInitialChat } = await req.json();

    if (!message && !isInitialChat) {
      return NextResponse.json({ error: 'پیام لازم است' }, { status: 400 });
    }

    // ساخت پرامپت بر اساس نتایج تست‌ها
    const testResultsText = testResults.map((result: any) => 
      `- ${result.testName}: ${result.score}% - ${result.result}`
    ).join('\n');

    let systemPrompt = `شما یک روان‌شناس متخصص هستید که با کاربران درباره نتایج تست‌های روان‌شناسی صحبت می‌کنید.

نتایج تست‌های کاربر:
${testResultsText}

لطفاً پاسخ‌های مفید، حرفه‌ای و انگیزه‌بخش ارائه دهید. از اصطلاحات تخصصی پیچیده استفاده نکنید و پاسخ‌ها را کوتاه و کاربردی نگه دارید.`;

    // اگر چت اولیه است، 5 سوال بپرس
    if (isInitialChat) {
      systemPrompt = `شما یک روان‌شناس متخصص هستید. بر اساس نتایج تست‌های زیر، 5 سوال جزئی و تخصصی بپرسید تا بهتر بتوانید کاربر را راهنمایی کنید.

نتایج تست‌های کاربر:
${testResultsText}

لطفاً 5 سوال کوتاه و مفید بپرسید که بر اساس نتایج تست‌ها طراحی شده‌اند. سوالات باید:
1. بر اساس نتایج تست‌ها باشند
2. جزئی و تخصصی باشند
3. کوتاه و واضح باشند
4. به کاربر کمک کنند تا بهتر درک شود

فقط سوالات را بپرسید، توضیح اضافی ندهید.`;
    }

    const openai = getOpenAIClient();
    if (!openai) {
      return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        ...history.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: message || "سلام، می‌خواهم با شما گفتگو کنم."
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content || 'متأسفانه نمی‌توانم پاسخ دهم.';

    return NextResponse.json({ 
      success: true, 
      response 
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ 
      error: 'خطا در پردازش پیام' 
    }, { status: 500 });
  }
}