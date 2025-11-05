import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { testId, testName, score, answers } = await req.json();

    if (!testId || typeof score !== "number") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // تولید تحلیل هوشمند با GPT
    const analysis = await generateTestAnalysis(testId, testName, score, answers);

    return NextResponse.json({
      success: true,
      analysis,
      testId,
      score
    });

  } catch (error) {
    console.error("Test Analysis Error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در تحلیل تست" },
      { status: 500 }
    );
  }
}

async function generateTestAnalysis(testId: string, testName: string, score: number, answers: number[]): Promise<string> {
  try {
    const prompt = `
    شما یک روان‌شناس متخصص هستید. بر اساس نتایج تست "${testName}" تحلیل دقیق و مفیدی ارائه دهید.
    
    اطلاعات تست:
    - نام تست: ${testName}
    - شناسه تست: ${testId}
    - نمره: ${score}%
    - پاسخ‌ها: ${answers.join(', ')}
    
    لطفاً تحلیل خود را شامل موارد زیر ارائه دهید:
    1. تفسیر نمره و وضعیت فعلی
    2. نقاط قوت و ضعف
    3. پیشنهادات عملی برای بهبود
    4. راهکارهای انگیزه‌بخش
    
    پاسخ را به فارسی، دوستانه و انگیزه‌بخش ارائه دهید (حداکثر 300 کلمه).
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "شما یک روان‌شناس متخصص هستید که تحلیل‌های دقیق، دوستانه و انگیزه‌بخش ارائه می‌دهید."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    return completion.choices[0].message?.content || "تحلیل نتایج شما آماده است.";
  } catch (error) {
    console.error("GPT Analysis Error:", error);
    return "تحلیل نتایج شما آماده است.";
  }
}



