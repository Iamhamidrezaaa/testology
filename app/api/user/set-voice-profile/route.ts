import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, tone, rate, pitch } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // اعتبارسنجی tone
    const validTones = ["calm", "warm", "supportive", "hopeful"];
    const finalTone = validTones.includes(tone) ? tone : "warm";
    
    // اعتبارسنجی rate و pitch
    const finalRate = Math.max(0.5, Math.min(2.0, rate || 1.0));
    const finalPitch = Math.max(0.5, Math.min(2.0, pitch || 1.0));

    const voiceProfile = await prisma.voiceProfile.upsert({
      where: { userId },
      update: {
        tone: finalTone,
        rate: finalRate,
        pitch: finalPitch,
      },
      create: {
        userId,
        tone: finalTone,
        rate: finalRate,
        pitch: finalPitch,
      },
    });

    return NextResponse.json({ 
      success: true, 
      voiceProfile 
    });
  } catch (err: any) {
    console.error("Set voice profile failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}











