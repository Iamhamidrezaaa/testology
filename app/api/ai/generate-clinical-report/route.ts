import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { withMonitoring } from "@/middleware/withMonitoring";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// تابع تحلیل احساسی متن
function analyzeTextSentiment(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  
  // کلمات مثبت و منفی برای تحلیل احساسی ساده
  const positiveWords = ['خوب', 'عالی', 'مثبت', 'بهتر', 'پیشرفت', 'موفق', 'قوی', 'انرژی', 'انگیزه', 'امیدوار'];
  const negativeWords = ['بد', 'ضعیف', 'منفی', 'مشکل', 'اضطراب', 'استرس', 'غم', 'نگران', 'خسته', 'ناامید'];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
    if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
  });
  
  const total = positiveCount + negativeCount;
  if (total === 0) return 0;
  
  return (positiveCount - negativeCount) / total;
}

async function generateReportHandler(req: Request) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    console.log(`🧠 شروع تولید گزارش بالینی برای کاربر ${userId}...`);

    // مرحله ۱: جمع‌آوری نتایج تست کاربر
    const results = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 15,
    });

    if (!results.length) {
      return NextResponse.json({ 
        success: false,
        message: "هیچ تستی برای کاربر یافت نشد." 
      });
    }

    console.log(`📊 ${results.length} تست برای تحلیل یافت شد`);

    // مرحله ۲: داده خام
    const data = results.map(
      (r) => `${r.testName}: score=${r.score}, summary=${r.summary || ""}`
    );

    // مرحله ۳: پرامپت برای تحلیل GPT
    const prompt = `
You are an AI clinical psychologist assistant specialized in psychological test interpretation.
Generate a comprehensive multi-dimensional psychological report based on the user's test results.

The report should include the following sections:
1. Overall Summary - A neutral, professional overview of the user's psychological profile
2. Mood Assessment - Analysis of emotional state and mood patterns
3. Anxiety Levels - Evaluation of anxiety symptoms and stress indicators
4. Motivation & Energy - Assessment of drive, motivation, and energy levels
5. Relationships & Social Connection - Analysis of social functioning and interpersonal dynamics
6. Self-esteem - Evaluation of self-worth and confidence levels
7. Focus & Cognitive Control - Assessment of attention, concentration, and cognitive functioning
8. AI Recommendation - Professional suggestions for next steps (not medical advice)

Guidelines:
- Use clear, human, and compassionate clinical language
- Maintain a professional, neutral tone
- Do NOT provide medical or treatment advice
- Focus on psychological insights and observations
- Be specific and evidence-based
- Use Persian language for the report

Input Data:
${data.join("\n")}

Generate a comprehensive clinical report in Persian.
`;

    console.log("🤖 ارسال به GPT برای تولید گزارش بالینی...");

    const gptRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 2000,
    });

    const text = gptRes.choices[0].message.content || "خروجی GPT خالی است";

    console.log("💾 ذخیره گزارش بالینی...");

    // مرحله ۴: ذخیره گزارش
    const saved = await prisma.clinicalReport.create({
      data: { 
        userId, 
        summary: text,
        mood: null, // در آینده می‌توان استخراج کرد
        anxiety: null,
        motivation: null,
        relationships: null,
        selfEsteem: null,
        focus: null,
        recommendation: null
      },
    });

    // تولید خودکار داده روند روانی از گزارش بالینی
    console.log("📈 تولید خودکار داده روند روانی از گزارش بالینی...");
    
    try {
      // استخراج امتیازات از بخش‌های مختلف گزارش
      const sections = [
        { text: saved.mood, category: "mood" },
        { text: saved.anxiety, category: "anxiety" },
        { text: saved.focus, category: "focus" },
        { text: saved.selfEsteem, category: "selfEsteem" },
        { text: saved.motivation, category: "motivation" }
      ];

      for (const section of sections) {
        if (section.text && section.text.trim()) {
          // تحلیل احساسی متن برای استخراج امتیاز
          const sentiment = analyzeTextSentiment(section.text);
          const score = Math.max(0, Math.min(100, (sentiment + 1) * 50));
          
          await prisma.moodTrend.create({
            data: {
              userId,
              category: section.category,
              score,
              source: "clinicalReport"
            }
          });
          
          console.log(`✅ روند روانی ${section.category} از گزارش ثبت شد: ${score}`);
        }
      }
    } catch (trendError) {
      console.error("خطا در ثبت روند روانی از گزارش:", trendError);
    }

    // فراخوانی خودکار لایه بازبین AI
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/ai/review-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: saved.id })
      });
    } catch (e) {
      console.warn("نتوانستیم بازبینی AI را به صورت خودکار فراخوانی کنیم:", e);
    }

    console.log("✅ گزارش بالینی با موفقیت تولید شد!");

    return NextResponse.json({ 
      success: true,
      message: "گزارش بالینی با موفقیت تولید شد",
      report: saved,
      userId: userId,
      testsAnalyzed: results.length
    });

  } catch (err) {
    console.error("❌ خطا در تولید گزارش بالینی:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در تولید گزارش بالینی"
    }, { status: 500 });
  }
}

export const POST = withMonitoring(generateReportHandler, "Clinical");
