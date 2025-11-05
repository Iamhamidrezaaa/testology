import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractSymbols(text: string): string[] {
  // استخراج ساده‌ی واژه‌های معنادار
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/)
    .filter((w) => w.length > 3);
}

function calculateSentiment(text: string): number {
  // محاسبه ساده احساس بر اساس کلمات کلیدی
  const positiveWords = ['خوب', 'مثبت', 'آرام', 'شاد', 'امید', 'نور', 'آبی', 'سبز'];
  const negativeWords = ['بد', 'منفی', 'اضطراب', 'ترس', 'تاریک', 'قرمز', 'سیاه'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  for (const word of words) {
    if (positiveWords.some(p => word.includes(p))) score += 1;
    if (negativeWords.some(n => word.includes(n))) score -= 1;
  }
  
  return Math.max(-1, Math.min(1, score / words.length));
}

export async function POST() {
  try {
    console.log("🧠 شروع تحلیل خواب‌ها و استخراج الگوها...");
    
    // مرحله ۱: خواندن خواب‌های اخیر
    const dreams = await prisma.dream.findMany({
      orderBy: { date: "desc" },
      take: 30,
    });

    if (dreams.length === 0) {
      return NextResponse.json({ 
        success: false,
        message: "هیچ خوابی برای تحلیل یافت نشد. ابتدا خواب‌هایی تولید کنید." 
      });
    }

    console.log(`📊 ${dreams.length} خواب برای تحلیل یافت شد`);

    // مرحله ۲: جمع‌آوری کل واژه‌ها
    const allWords = dreams.flatMap((d) => extractSymbols(d.content));
    const freq: Record<string, number> = {};

    for (const w of allWords) {
      freq[w] = (freq[w] || 0) + 1;
    }

    // مرحله ۳: انتخاب ۱۰ نماد پرتکرار
    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const symbols = sorted.map(([symbol, frequency]) => ({
      symbol,
      frequency,
    }));

    console.log("🔍 نمادهای پرتکرار شناسایی شدند:", symbols);

    // مرحله ۴: ارسال به GPT برای تحلیل معنایی
    const prompt = `
You are Testology's unconscious mind analyzing dream patterns.
These are recurring dream symbols and their frequencies from recent dreams:
${JSON.stringify(symbols, null, 2)}

For each symbol, interpret its meaning in psychological terms and suggest which tests might relate (like anxiety, depression, stress, etc.).
Respond in JSON list format:
[
  {
    "symbol": "نماد",
    "meaning": "تفسیر روانشناختی نماد",
    "relatedTests": ["تست اضطراب", "تست افسردگی"],
    "sentiment": 0.7
  }
]

Analyze these symbols from a psychological perspective and suggest relevant psychological tests.
`;

    console.log("🤖 ارسال به GPT برای تحلیل معنایی...");

    const gptRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 1000,
    });

    const output = gptRes.choices[0].message.content;
    
    if (!output) {
      throw new Error("GPT response is empty");
    }

    let analysis;
    try {
      analysis = JSON.parse(output);
    } catch (error) {
      // اگر JSON نبود، ساختار دستی بساز
      analysis = symbols.map(s => ({
        symbol: s.symbol,
        meaning: `تفسیر خودکار برای ${s.symbol}`,
        relatedTests: ["تست عمومی"],
        sentiment: calculateSentiment(s.symbol)
      }));
    }

    console.log("💾 ذخیره الگوهای کشف شده...");

    // مرحله ۵: ذخیره در جدول DreamPattern
    const savedPatterns = [];
    for (const item of analysis) {
      const saved = await prisma.dreamPattern.create({
        data: {
          symbol: item.symbol,
          frequency: symbols.find((s) => s.symbol === item.symbol)?.frequency || 1,
          meaning: item.meaning,
          sentiment: item.sentiment || calculateSentiment(item.symbol),
          relatedTests: JSON.stringify(item.relatedTests || []),
        },
      });
      savedPatterns.push(saved);
    }

    console.log("✅ تحلیل خواب‌ها با موفقیت انجام شد!");

    return NextResponse.json({
      success: true,
      message: "تحلیل خواب‌ها و استخراج الگوها با موفقیت انجام شد",
      patterns: savedPatterns,
      totalDreams: dreams.length,
      symbolsAnalyzed: symbols.length
    });

  } catch (err) {
    console.error("❌ خطا در تحلیل خواب‌ها:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در تحلیل خواب‌ها و استخراج الگوها"
    }, { status: 500 });
  }
}











