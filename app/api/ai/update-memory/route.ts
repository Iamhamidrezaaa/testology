import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getOpenAIClient } from '@/lib/openai-client';
import { withMonitoring } from "@/middleware/withMonitoring";


async function updateMemoryHandler(req: Request) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // دریافت جلسات اخیر
    const sessions = await prisma.therapySession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    if (sessions.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "No sessions to analyze" 
      });
    }

    // استخراج پیام‌های اخیر
    const recentMessages = sessions
      .flatMap((s) => {
        try {
          return JSON.parse(s.messages) as any[];
        } catch {
          return [];
        }
      })
      .map((m: any) => `${m.role}: ${m.content}`)
      .join("\n");

    // دریافت تحلیل‌های هیجانی اخیر
    const emotionLogs = await prisma.emotionLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const emotionSummary = emotionLogs
      .map((e) => `${e.emotion}(${e.intensity.toFixed(1)})`)
      .join(", ");

    const prompt = `
You are a clinical dialogue summarizer specializing in therapy sessions.
Analyze the user's recent therapy sessions and create a comprehensive memory summary.

Recent conversations:
${recentMessages}

Emotions detected:
${emotionSummary}

Create a summary in 3 short paragraphs:
1. Key themes and recurring emotions
2. User's main concerns and progress areas
3. Important insights for future sessions

Also, identify 3-5 emotion tags that best represent the user's emotional patterns.

Return JSON:
{
  "summary": "Paragraph 1: Key themes...\n\nParagraph 2: Main concerns...\n\nParagraph 3: Insights...",
  "keyInsights": "Specific insights about triggers, patterns, and progress",
  "emotionTags": ["tag1", "tag2", "tag3"]
}
`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const rawResponse = res.choices[0].message.content?.trim() || "{}";
    let parsed: any = {};
    
    try {
      parsed = JSON.parse(rawResponse);
    } catch (e) {
      parsed = {
        summary: "No summary available",
        keyInsights: "No insights available",
        emotionTags: ["neutral"]
      };
    }

    // ذخیره یا به‌روزرسانی حافظه
    const memory = await prisma.therapyMemory.upsert({
      where: { userId },
      update: {
        summary: parsed.summary || "No summary available",
        keyInsights: parsed.keyInsights || "No insights available",
        emotionTags: JSON.stringify(parsed.emotionTags || ["neutral"]),
      },
      create: {
        userId,
        summary: parsed.summary || "No summary available",
        keyInsights: parsed.keyInsights || "No insights available",
        emotionTags: JSON.stringify(parsed.emotionTags || ["neutral"]),
      },
    });

    return NextResponse.json({ 
      success: true, 
      memory: {
        ...memory,
        emotionTags: JSON.parse(memory.emotionTags || "[]")
      }
    });
  } catch (err: any) {
    console.error("Memory update failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export const POST = withMonitoring(updateMemoryHandler, "Memory");











