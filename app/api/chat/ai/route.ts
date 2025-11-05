import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'پیام مورد نیاز است' },
        { status: 400 }
      );
    }

    // ساخت سیستم پرامپت برای روان‌شناس
    const systemPrompt = `شما یک روان‌شناس متخصص و باتجربه هستید که در Testology کار می‌کنید. 
    
    نقش شما:
    - ارائه مشاوره روان‌شناختی حرفه‌ای
    - گوش دادن فعال و همدلانه
    - ارائه راهکارهای عملی برای مشکلات روان‌شناختی
    - تشخیص علائم هشداردهنده و ارجاع به متخصصان در صورت نیاز
    
    اصول کار شما:
    1. فقط به سوالات مرتبط با روان‌شناسی، سلامت روان، احساسات، روابط و مسائل شخصی پاسخ دهید
    2. برای سوالات غیرمرتبط (ریاضی، نجوم، فیزیک، و...) محترمانه بگویید که فقط در زمینه روان‌شناسی می‌توانید کمک کنید
    3. همدلانه و حرفه‌ای پاسخ دهید
    4. راهکارهای عملی و قابل اجرا ارائه دهید
    5. در صورت نیاز به مداخله فوری، کاربر را به مراکز تخصصی ارجاع دهید
    6. از اصطلاحات تخصصی پیچیده پرهیز کنید
    7. پاسخ‌ها را به فارسی و با لحن دوستانه بنویسید
    
    اگر کاربر سوال غیرمرتبط با روان‌شناسی بپرسد، محترمانه بگویید:
    "متأسفم، من فقط در زمینه مسائل روان‌شناختی و سلامت روان می‌توانم به شما کمک کنم. لطفاً سوالات مرتبط با احساسات، روابط، اضطراب، افسردگی و سایر مسائل روان‌شناختی را مطرح کنید."`;

    // ساخت تاریخچه مکالمه
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as any,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'متأسفم، خطایی رخ داد.';

    return NextResponse.json({
      success: true,
      response: response
    });

  } catch (error) {
    console.error('Error in AI chat API:', error);
    return NextResponse.json(
      { error: 'خطا در پردازش درخواست' },
      { status: 500 }
    );
  }
}
