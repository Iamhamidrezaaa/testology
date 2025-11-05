import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { withMonitoring } from "@/middleware/withMonitoring";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateSessionPlanHandler(req: Request) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // دریافت حافظه درمانی
    const memory = await prisma.therapyMemory.findUnique({ 
      where: { userId } 
    });

    // دریافت احساسات اخیر
    const emotions = await prisma.emotionLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // دریافت روند خلق و خو
    const moodTrend = await prisma.moodTrend.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // دریافت آخرین برنامه جلسه (اگر وجود دارد)
    const lastPlan = await prisma.sessionPlan.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const context = `
User therapy memory summary: ${memory?.summary || "No memory available"}
Key insights: ${memory?.keyInsights || "No insights available"}
Recent emotions: ${emotions.map((e) => `${e.emotion}(${e.intensity.toFixed(1)})`).join(", ")}
Recent mood scores: ${moodTrend.map((m) => `${m.category}:${m.score}`).join(", ")}
Last session plan: ${lastPlan?.topic || "No previous plan"}
`;

    const prompt = `
You are an AI therapy session planner specializing in mental health and personal growth.
Based on the user's therapy history, recent emotions, and mood trends, create a personalized session plan.

Guidelines:
- Focus on the most pressing emotional needs
- Suggest relevant psychological tests if needed
- Recommend practical daily exercises
- Consider the user's emotional patterns and triggers
- Build on previous sessions and progress
- Use Persian language for all outputs

Return JSON with:
{
  "topic": "عنوان جلسه (کوتاه و انسانی)",
  "focusArea": "تمرکز درمانی اصلی (مثل مدیریت اضطراب، بهبود عزت نفس، افزایش انگیزه)",
  "suggestedTest": "نام تست روانشناسی مناسب (یا null اگر نیازی نیست)",
  "dailyPractice": "تمرین ساده روزانه یا فعالیت ذهن‌آگاهی",
  "aiConfidence": 0.0-1.0
}

User context:
${context}
`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const rawResponse = res.choices[0].message.content?.trim() || "{}";
    let parsed: any = {};
    
    try {
      parsed = JSON.parse(rawResponse);
    } catch (e) {
      // مقادیر پیش‌فرض در صورت خطا
      parsed = {
        topic: "گفت‌وگوی آزاد احساسی",
        focusArea: "خودآگاهی و رشد شخصی",
        suggestedTest: null,
        dailyPractice: "تمرین تنفس آگاهانه ۵ دقیقه در روز",
        aiConfidence: 0.7
      };
    }

    // ذخیره برنامه جلسه
    const plan = await prisma.sessionPlan.create({
      data: {
        userId,
        topic: parsed.topic || "گفت‌وگوی آزاد احساسی",
        focusArea: parsed.focusArea || "خودآگاهی و رشد شخصی",
        suggestedTest: parsed.suggestedTest || null,
        dailyPractice: parsed.dailyPractice || "تمرین تنفس آگاهانه ۵ دقیقه در روز",
        aiConfidence: Math.max(0, Math.min(1, parsed.aiConfidence || 0.7)),
      },
    });

    return NextResponse.json({ 
      success: true, 
      plan,
      context: {
        hasMemory: !!memory,
        emotionCount: emotions.length,
        moodCount: moodTrend.length,
        hasPreviousPlan: !!lastPlan
      }
    });
  } catch (err: any) {
    console.error("Session planning failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export const POST = withMonitoring(generateSessionPlanHandler, "SessionPlan");











