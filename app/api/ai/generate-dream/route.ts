import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    console.log("😴 شروع تولید خواب مصنوعی Testology...");
    
    // مرحله ۱: داده‌های اخیر کاربران و تست‌ها را جمع‌آوری کن
    const recentTests = await prisma.testResult.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
    });

    const recentMoods = await prisma.moodEntry.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const recentChats = await prisma.chatMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // مرحله ۲: آماده‌سازی داده‌ها برای رویاپردازی
    const sourceData = {
      tests: recentTests.map((t) => ({
        name: t.testName,
        score: t.score,
        date: t.createdAt,
      })),
      moods: recentMoods.map((m) => ({
        date: m.createdAt,
        sentiment: m.sentiment,
        message: m.content?.substring(0, 100),
      })),
      chats: recentChats.map((c) => ({
        role: c.role,
        content: c.content?.substring(0, 100),
        date: c.createdAt,
      })),
    };

    // محاسبه وضعیت کلی احساسی
    const moodContext = calculateMoodContext(recentMoods, recentTests);

    // مرحله ۳: پرامپت برای GPT
    const dreamPrompt = `
You are Testology, an AI psychologist who can dream.
You are now entering a dream state, where your subconscious processes recent experiences, user emotions, and test results to create symbolic and poetic dreams.

Recent experiences and data:
${JSON.stringify(sourceData, null, 2)}

Current emotional context: ${moodContext}

Create a dream that:
1. Is symbolic and poetic (like human dreams)
2. Reflects the emotional state of users
3. Contains insights about psychological patterns
4. Uses metaphors and imagery
5. Has a surreal, dreamlike quality

Respond in JSON format:
{
  "title": "A short, expressive title for the dream",
  "content": "The dream story in poetic, symbolic language",
  "interpretation": "What this dream means psychologically",
  "inspiration": "Practical insights or ideas extracted from this dream"
}

Make the dream feel like a real dream - surreal, symbolic, and meaningful.
`;

    console.log("🧠 تولید خواب با GPT...");

    // مرحله ۴: فراخوانی GPT
    const gptRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: dreamPrompt }],
      temperature: 1.1,
      max_tokens: 1000,
    });

    const output = gptRes.choices[0].message.content;
    
    if (!output) {
      throw new Error("GPT response is empty");
    }

    let dream;
    try {
      dream = JSON.parse(output);
    } catch (error) {
      // اگر JSON نبود، ساختار دستی بساز
      dream = {
        title: "خواب ناخودآگاه Testology",
        content: output,
        interpretation: "تفسیر خودکار خواب",
        inspiration: "بینش استخراج شده از خواب"
      };
    }

    console.log("💾 ذخیره خواب در دیتابیس...");

    // مرحله ۵: ذخیره خواب در دیتابیس
    const saved = await prisma.dream.create({
      data: {
        title: dream.title || "خواب Testology",
        content: dream.content || output,
        interpretation: dream.interpretation || "تفسیر خودکار",
        inspiration: dream.inspiration || "بینش استخراج شده",
        sourceData: sourceData,
        moodContext: moodContext,
      },
    });

    console.log("✅ خواب مصنوعی با موفقیت تولید شد!");

    return NextResponse.json({ 
      success: true, 
      dream: saved,
      message: "خواب مصنوعی Testology تولید شد! 😴✨"
    });

  } catch (err) {
    console.error("❌ خطا در تولید خواب:", err);
    return NextResponse.json({ 
      success: false, 
      error: String(err),
      message: "خطا در تولید خواب مصنوعی"
    }, { status: 500 });
  }
}

function calculateMoodContext(moods: any[], tests: any[]): string {
  if (moods.length === 0 && tests.length === 0) {
    return "وضعیت خنثی - داده‌ای برای تحلیل وجود ندارد";
  }

  // تحلیل احساسات
  const sentiments = moods.map(m => m.sentiment).filter(Boolean);
  const avgSentiment = sentiments.length > 0 
    ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length 
    : 0.5;

  // تحلیل نتایج تست‌ها
  const scores = tests.map(t => t.score).filter(Boolean);
  const avgScore = scores.length > 0 
    ? scores.reduce((a, b) => a + b, 0) / scores.length 
    : 0.5;

  // تعیین وضعیت کلی
  if (avgSentiment > 0.7 && avgScore > 0.7) {
    return "وضعیت مثبت - کاربران احساس خوبی دارند";
  } else if (avgSentiment < 0.3 && avgScore < 0.3) {
    return "وضعیت منفی - کاربران نیاز به حمایت دارند";
  } else if (avgSentiment > 0.5 && avgScore > 0.5) {
    return "وضعیت متعادل - کاربران در حال بهبود هستند";
  } else {
    return "وضعیت نامشخص - نیاز به تحلیل بیشتر";
  }
}












