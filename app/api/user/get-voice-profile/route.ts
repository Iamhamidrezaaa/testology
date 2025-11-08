import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const voiceProfile = await prisma.voiceProfile.findUnique({
      where: { userId },
    });

    // اگر پروفایل وجود نداشت، پروفایل پیش‌فرض برگردان
    const defaultProfile = {
      userId,
      tone: "warm",
      rate: 1.0,
      pitch: 1.0,
    };

    return NextResponse.json({ 
      voiceProfile: voiceProfile || defaultProfile 
    });
  } catch (err: any) {
    console.error("Get voice profile failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}











