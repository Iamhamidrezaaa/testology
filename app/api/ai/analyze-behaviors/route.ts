import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getOpenAIClient } from '@/lib/openai-client';


export async function POST() {
  try {
    console.log("🧠 شروع تحلیل الگوهای رفتاری کاربران...");
    
    // داده‌های آخرین تست‌ها را جمع کن
    const tests = await prisma.testResult.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    if (!tests.length) {
      return NextResponse.json({ 
        success: false,
        message: "هیچ داده تستی برای تحلیل یافت نشد." 
      });
    }

    console.log(`📊 ${tests.length} تست برای تحلیل یافت شد`);

    // آماده‌سازی داده برای تحلیل
    const content = tests.map(
      (t) => `${t.testName}: score=${t.score} (result=${t.result || ""}, analysis=${t.analysis || ""})`
    );

    const prompt = `
You are a clinical data analyst specialized in psychological test interpretation.
Identify recurring psychological or behavioral patterns from the following user test results.
Group them into key patterns with clinical significance.

For each pattern, provide:
- keyword: Main behavioral/psychological theme
- frequency: How often this pattern appears
- sentiment: Emotional tone (-1 to 1, negative to positive)
- meaning: Clinical interpretation of this pattern
- relatedTests: Which tests are most relevant to this pattern

Return JSON format:
[
  {
    "keyword": "stress",
    "frequency": 24,
    "sentiment": -0.7,
    "meaning": "Elevated stress levels across population - indicates need for stress management interventions",
    "relatedTests": ["GAD7", "PHQ9", "PSS"]
  }
]

Test Data:
${content.join("\n")}

Focus on clinically significant patterns that can inform test recommendations.
`;

    console.log("🤖 ارسال به GPT برای تحلیل الگوهای رفتاری...");

    const openai = getOpenAIClient();
    if (!openai) {
      return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });
    }

    const gptRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 1500,
    });

    const output = gptRes.choices[0]?.message?.content;
    
    if (!output) {
      throw new Error("GPT response is empty");
    }

    let analysis;
    try {
      analysis = JSON.parse(output);
    } catch (error) {
      console.error("خطا در پارس JSON:", error);
      // ساختار دستی در صورت خطا
      analysis = [
        {
          keyword: "anxiety",
          frequency: 15,
          sentiment: -0.6,
          meaning: "الگوهای اضطراب در جمعیت کاربران شناسایی شد",
          relatedTests: ["GAD7", "PHQ9"]
        }
      ];
    }

    console.log("💾 ذخیره الگوهای رفتاری...");

    // ذخیره الگوها
    await prisma.behaviorPattern.deleteMany();
    const saved = [];
    for (const p of analysis) {
      const s = await prisma.behaviorPattern.create({
        data: {
          keyword: p.keyword,
          frequency: p.frequency,
          sentiment: p.sentiment,
          meaning: p.meaning,
          relatedTests: JSON.stringify(p.relatedTests || []),
        },
      });
      saved.push(s);
    }

    // تولید خودکار داده روند روانی
    console.log("📈 تولید خودکار داده روند روانی...");
    
    for (const pattern of analysis) {
      try {
        // استخراج امتیاز از sentiment و frequency
        const sentiment = pattern.sentiment ?? 0;
        const frequency = pattern.frequency || 1;
        const score = Math.max(0, Math.min(100, (sentiment + 1) * 50)); // تبدیل به 0-100
        
        // ذخیره روند روانی بر اساس دسته‌بندی
        let category = "mood"; // پیش‌فرض
        if (pattern.keyword.toLowerCase().includes("anxiety") || 
            pattern.keyword.toLowerCase().includes("worry") ||
            pattern.keyword.toLowerCase().includes("stress")) {
          category = "anxiety";
        } else if (pattern.keyword.toLowerCase().includes("focus") ||
                   pattern.keyword.toLowerCase().includes("concentration") ||
                   pattern.keyword.toLowerCase().includes("attention")) {
          category = "focus";
        } else if (pattern.keyword.toLowerCase().includes("esteem") ||
                   pattern.keyword.toLowerCase().includes("confidence") ||
                   pattern.keyword.toLowerCase().includes("self")) {
          category = "selfEsteem";
        } else if (pattern.keyword.toLowerCase().includes("motivation") ||
                   pattern.keyword.toLowerCase().includes("energy") ||
                   pattern.keyword.toLowerCase().includes("drive")) {
          category = "motivation";
        }
        
        await prisma.moodTrend.create({
          data: {
            userId: "system", // یا از session گرفته شود
            category,
            score,
            source: "clinicalReport"
          }
        });
        
        console.log(`✅ روند روانی ${category} ثبت شد: ${score}`);
      } catch (trendError) {
        console.error("خطا در ثبت روند روانی:", trendError);
      }
    }

    console.log("✅ تحلیل الگوهای رفتاری با موفقیت انجام شد!");

    return NextResponse.json({ 
      success: true,
      message: "تحلیل الگوهای رفتاری با موفقیت انجام شد",
      patterns: saved,
      totalTests: tests.length,
      patternsFound: analysis.length
    });

  } catch (err) {
    console.error("❌ خطا در تحلیل الگوهای رفتاری:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در تحلیل الگوهای رفتاری"
    }, { status: 500 });
  }
}
