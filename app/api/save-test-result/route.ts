import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOpenAIClient } from '@/lib/openai-client';




export async function POST(req: NextRequest) {
  try {
    const { testId, testName, answers, score, userId } = await req.json();

    // ذخیره نتایج در Prisma
    const testResult = await prisma.testResult.create({
      data: {
        userId: userId || 'demo-user',
        testName: testName,
        testId: testId,
        score: score,
        answers: JSON.stringify(answers),
        result: getResultText(score),
        createdAt: new Date(),
      },
    });

    // تولید تحلیل هوشمند با GPT
    const analysis = await generateAnalysis(testId, testName, score, answers);

    return NextResponse.json({
      success: true,
      testResult,
      analysis,
    });

  } catch (error) {
    console.error("Save Test Result Error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ذخیره نتایج" },
      { status: 500 }
    );
  }
}

function getResultText(score: number): string {
  if (score >= 80) return "عالی - شما در این زمینه عملکرد بسیار خوبی دارید";
  if (score >= 60) return "خوب - شما در این زمینه عملکرد مناسبی دارید";
  if (score >= 40) return "متوسط - شما در این زمینه نیاز به بهبود دارید";
  return "نیاز به بهبود - شما در این زمینه نیاز به تمرین و تلاش بیشتری دارید";
}

async function generateAnalysis(testId: string, testName: string, score: number, answers: number[]): Promise<string> {
  try {
    const prompt = `
    شما یک روان‌شناس متخصص هستید. بر اساس نتایج تست "${testName}" تحلیل کوتاه و مفیدی ارائه دهید.
    
    اطلاعات تست:
    - نام تست: ${testName}
    - نمره: ${score}%
    - پاسخ‌ها: ${answers.join(', ')}
    
    لطفاً تحلیل خود را شامل موارد زیر ارائه دهید:
    1. تفسیر نمره
    2. نقاط قوت
    3. نقاط ضعف
    4. پیشنهادات بهبود
    
    پاسخ را کوتاه، مفید و انگیزه‌بخش ارائه دهید (حداکثر 200 کلمه).
    `;

    const client = getOpenAIClient();
    if (!client) {
      return "تحلیل نتایج شما آماده است.";
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "شما یک روان‌شناس متخصص هستید که تحلیل‌های دقیق و انگیزه‌بخش ارائه می‌دهید."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return completion.choices[0].message?.content || "تحلیل نتایج شما آماده است.";
  } catch (error) {
    console.error("GPT Analysis Error:", error);
    return "تحلیل نتایج شما آماده است.";
  }
}



