import { NextResponse } from "next/server";
import { getOpenAIClient } from '@/lib/openai-client';
import prisma from "@/lib/prisma";
import { withMonitoring } from "@/middleware/withMonitoring";


async function generateVoiceHandler(req: Request) {
  try {
    const { userId, text } = await req.json();
    
    if (!text || !userId) {
      return NextResponse.json({ error: "Missing text or userId" }, { status: 400 });
    }

    // دریافت آخرین احساس کاربر
    const emotion = await prisma.emotionLog.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // دریافت تنظیمات صوتی کاربر
    const voiceProfile = await prisma.voiceProfile.findUnique({
      where: { userId },
    });

    // انتخاب لحن بر اساس احساس و تنظیمات کاربر
    const toneMap: Record<string, any> = {
      joy: { voice: "nova", speed: 1.1, pitch: 1.05 },
      sadness: { voice: "alloy", speed: 0.85, pitch: 0.9 },
      anger: { voice: "echo", speed: 1.2, pitch: 1.1 },
      anxiety: { voice: "fable", speed: 0.9, pitch: 1.0 },
      calm: { voice: "onyx", speed: 1.0, pitch: 1.0 },
      hope: { voice: "nova", speed: 1.05, pitch: 1.05 },
    };

    const defaultTone = { voice: "alloy", speed: 1.0, pitch: 1.0 };
    const emotionTone = emotion ? toneMap[emotion.emotion] || defaultTone : defaultTone;
    
    // ترکیب تنظیمات کاربر با تنظیمات احساسی
    const finalTone = {
      voice: voiceProfile?.tone === "calm" ? "alloy" : 
             voiceProfile?.tone === "warm" ? "nova" :
             voiceProfile?.tone === "supportive" ? "fable" :
             voiceProfile?.tone === "hopeful" ? "nova" : emotionTone.voice,
      speed: voiceProfile?.rate || emotionTone.speed,
      pitch: voiceProfile?.pitch || emotionTone.pitch,
    };

    // تولید صوت با OpenAI TTS
    const ttsResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: finalTone.voice as any,
      input: text,
      response_format: "mp3",
    });

    const buffer = Buffer.from(await ttsResponse.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `inline; filename="therapy_voice_${Date.now()}.mp3"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    console.error("TTS generation error:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export const POST = withMonitoring(generateVoiceHandler, "Voice");











