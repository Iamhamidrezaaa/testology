import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export async function POST(req: Request) {
  try {
    const { clientId, clinicianId } = await req.json();
    
    if (!clientId || !clinicianId) {
      return NextResponse.json({ 
        success: false,
        error: "Missing required fields: clientId and clinicianId" 
      }, { status: 400 });
    }

    console.log(`🧠 تولید گزارش بالینی برای مراجع ${clientId}...`);

    // دریافت تست‌های مراجع
    const tests = await prisma.clientTestResult.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    if (!tests.length) {
      return NextResponse.json({ 
        success: false,
        message: "هیچ داده تستی برای مراجع یافت نشد." 
      });
    }

    console.log(`📊 ${tests.length} تست برای تحلیل یافت شد`);

    // آماده‌سازی داده
    const data = tests
      .map((t) => `${t.testName}: score=${t.score}, summary=${t.summary || ""}`)
      .join("\n");

    // تولید گزارش بالینی
    const prompt = `
You are an AI clinical assistant specialized in psychological test interpretation.
Generate a comprehensive report for the therapist, including:
- Overview of psychological profile
- Mood assessment
- Anxiety levels
- Motivation and energy
- Self-esteem evaluation
- Relationship patterns
- Cognitive functioning
- Clinical recommendations

Use professional clinical language and maintain confidentiality.
Focus on therapeutic insights and treatment planning.

Test Data:
${data}

Generate a detailed clinical report in Persian.
`;

    console.log("🤖 ارسال به GPT برای تولید گزارش بالینی...");

    const gpt = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 2000,
    });

    const report = gpt.choices[0].message.content || "خروجی GPT خالی است";

    // تحلیل ریسک
    console.log("🚨 تحلیل ریسک روانی...");

    const riskPrompt = `
You are a clinical risk analyzer specialized in psychological assessment.
Evaluate the following clinical report and classify the risk level.
Respond in JSON format: {"level":"low|medium|high|critical","category":"anxiety|depression|suicide|self-harm|stress|other"}

Guidelines:
- low: Normal psychological functioning
- medium: Mild concerns, routine follow-up recommended
- high: Significant psychological distress, immediate attention needed
- critical: Severe risk indicators, urgent intervention required

Clinical Report:
${report}
`;

    const riskRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: riskPrompt }],
      temperature: 0,
      max_tokens: 200,
    });

    let risk;
    try {
      risk = JSON.parse(riskRes.choices[0].message.content);
    } catch (error) {
      console.error("خطا در پارس تحلیل ریسک:", error);
      risk = { level: "medium", category: "other" };
    }

    console.log(`⚠️ سطح ریسک: ${risk.level} (${risk.category})`);

    // ذخیره گزارش بالینی
    const savedNote = await prisma.clientClinicalNote.create({
      data: { 
        clientId, 
        clinicianId, 
        aiReport: report 
      },
    });

    // ذخیره پرچم ریسک
    await prisma.riskFlag.create({
      data: {
        clinicianId,
        reportId: savedNote.id,
        level: risk.level,
        category: risk.category,
        aiSummary: report.slice(0, 250),
      },
    });

    console.log("✅ گزارش بالینی و تحلیل ریسک با موفقیت ذخیره شد");

    return NextResponse.json({ 
      success: true, 
      report, 
      risk,
      noteId: savedNote.id,
      message: "گزارش بالینی و تحلیل ریسک با موفقیت تولید شد"
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











