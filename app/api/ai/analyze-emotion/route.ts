import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { withMonitoring } from "@/middleware/withMonitoring";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function analyzeEmotionHandler(req: Request) {
  try {
    const { userId, message, typingTime } = await req.json();
    
    if (!message || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // محاسبه امتیاز تایپ (هرچه تایپ سریع‌تر، هیجان بیشتر)
    const typingScore = typingTime
      ? Math.max(0, Math.min(1, 1 - typingTime / 10))
      : 0.5;

    const prompt = `
You are an affective language analyst specializing in Persian and English emotional text.
Analyze the emotion in this message and return ONLY a JSON object with:
{
  "emotion": "joy|sadness|anger|anxiety|calm|hope",
  "intensity": 0.0-1.0
}

Guidelines:
- joy: happiness, excitement, satisfaction, optimism
- sadness: grief, disappointment, melancholy, despair
- anger: frustration, irritation, rage, resentment
- anxiety: worry, nervousness, fear, panic
- calm: peace, tranquility, stability, contentment
- hope: optimism, anticipation, faith, aspiration

Message to analyze: "${message}"

Return only the JSON object, no other text.
`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const rawResponse = res.choices[0].message.content?.trim() || "{}";
    let parsed: any = {};
    
    try {
      parsed = JSON.parse(rawResponse);
    } catch (e) {
      // اگر JSON parse نشد، مقادیر پیش‌فرض
      parsed = { emotion: "calm", intensity: 0.5 };
    }

    // اعتبارسنجی و تصحیح مقادیر
    const validEmotions = ["joy", "sadness", "anger", "anxiety", "calm", "hope"];
    const emotion = validEmotions.includes(parsed.emotion) ? parsed.emotion : "calm";
    const intensity = Math.max(0, Math.min(1, parsed.intensity || 0.5));

    const emotionLog = await prisma.emotionLog.create({
      data: {
        userId,
        message,
        emotion,
        intensity,
        typingScore,
      },
    });

    return NextResponse.json({ 
      success: true, 
      emotionLog,
      analysis: {
        emotion,
        intensity,
        typingScore,
        confidence: intensity * typingScore
      }
    });
  } catch (err: any) {
    console.error("Emotion analysis failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export const POST = withMonitoring(analyzeEmotionHandler, "Emotion");











