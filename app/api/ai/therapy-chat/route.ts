import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { withMonitoring } from "@/middleware/withMonitoring";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function therapyChatHandler(req: Request) {
  try {
    const { userId, message } = await req.json();
    if (!userId || !message) {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

    // دریافت چند داده قبلی از کاربر برای کانتکست
    const lastMood = await prisma.moodTrend.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const lastReport = await prisma.clinicalReport.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // دریافت آخرین تحلیل هیجان کاربر
    const lastEmotion = await prisma.emotionLog.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // دریافت حافظه درمانی کاربر
    const memory = await prisma.therapyMemory.findUnique({ 
      where: { userId } 
    });

    const moodTone = lastEmotion
      ? `User's current emotional state: ${lastEmotion.emotion} with intensity ${lastEmotion.intensity}.`
      : "";

    const memoryContext = memory
      ? `User's therapy memory:
      Summary: ${memory.summary}
      Key insights: ${memory.keyInsights}
      Emotion tags: ${JSON.parse(memory.emotionTags || "[]").join(", ")}`
      : "No prior therapy memory available.";

    const systemPrompt = `
You are "Testology AI Therapist", a warm, empathetic and non-clinical conversational assistant.
Your goal: support mental wellness without giving medical advice.

User's latest mood: ${lastMood?.category || "unknown"} (${lastMood?.score || 50}/100)
Last report summary: ${lastReport?.summary || "No recent report"}
${moodTone}

${memoryContext}

Guidelines:
- Be warm, empathetic, and supportive
- Use Persian language naturally
- Show continuity with previous conversations (e.g., "You mentioned before that...", "I remember you said...")
- Reference past emotions and progress when relevant
- Adapt your tone to match the user's emotional state
- If user seems sad/anxious, be extra gentle and reassuring
- If user seems angry, acknowledge their feelings and help them process
- If user seems hopeful/joyful, celebrate with them but stay grounded
- Don't give medical diagnoses or treatment advice
- Suggest self-care activities and mindfulness exercises
- Encourage professional help when appropriate
- Keep responses conversational and not too long
- Ask follow-up questions to understand better

Respond with kindness, reflection, and helpful self-care suggestions that match the user's emotional needs and show awareness of their therapy history.
`;

    const chatRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = chatRes.choices[0].message.content?.trim() || "من اینجا هستم تا کمکت کنم.";

    // ذخیره در دیتابیس
    await prisma.therapySession.create({
      data: {
        userId,
        messages: [
          { role: "user", content: message }, 
          { role: "assistant", content: reply }
        ],
      },
    });

    // به‌روزرسانی حافظه درمانی (غیرهمزمان)
    fetch("/api/ai/update-memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }).catch(e => console.warn("Memory update failed:", e));

    // بررسی پایان جلسه و تولید برنامه جلسه بعد
    const endSessionKeywords = /خداحافظ|جلسه تموم|تمام|پایان|خداحافظی|بای|bye|goodbye|finish|end/i;
    if (endSessionKeywords.test(message)) {
      fetch("/api/ai/generate-session-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }).catch(e => console.warn("Session plan generation failed:", e));
    }

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Therapy chat failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export const POST = withMonitoring(therapyChatHandler, "Therapy");
