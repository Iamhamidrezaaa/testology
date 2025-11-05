import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json();

    const prompt = `
    شما یک روان‌شناس متخصص در زمینه انگیزه و هدف‌گذاری هستید.
    بر اساس پاسخ‌های کاربر، تحلیل کاملی از انگیزه‌ها، اهداف و مسیر زندگی او ارائه دهید.
    
    پاسخ‌های کاربر:
    ${JSON.stringify(answers, null, 2)}
    
    لطفاً تحلیل خود را شامل موارد زیر ارائه دهید:
    1. سطح انگیزه و هدف‌گذاری
    2. نقاط قوت و ضعف
    3. پیشنهادات برای بهبود
    4. راهکارهای عملی
    5. انگیزه‌بخشی و تشویق
    
    پاسخ را به فارسی و با لحن دوستانه و انگیزه‌بخش ارائه دهید.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "شما یک روان‌شناس متخصص در زمینه انگیزه و هدف‌گذاری هستید که تحلیل‌های دقیق و انگیزه‌بخش ارائه می‌دهید."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const analysis = completion.choices[0].message?.content || "تحلیل در دسترس نیست.";

    return NextResponse.json({
      success: true,
      analysis: analysis,
      recommendations: [
        "اهداف خود را به صورت SMART تعریف کنید",
        "هر روز قدم کوچکی به سمت اهدافتان بردارید",
        "پیشرفت‌های خود را جشن بگیرید",
        "از دیگران کمک بگیرید",
        "انعطاف‌پذیر باشید و در صورت نیاز اهداف را تعدیل کنید"
      ]
    });

  } catch (error) {
    console.error("Motivation Goals Analysis Error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در تحلیل تست" },
      { status: 500 }
    );
  }
}



