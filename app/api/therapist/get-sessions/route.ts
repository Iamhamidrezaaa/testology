import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const therapistId = searchParams.get("therapistId");
    
    if (!therapistId) {
      return NextResponse.json({ error: "Missing therapistId" }, { status: 400 });
    }

    const sessions = await prisma.sessionBooking.findMany({
      where: { 
        therapistId,
        type: "HUMAN"
      },
      orderBy: { date: "asc" },
      take: 50 // محدود کردن برای عملکرد بهتر
    });

    // افزودن اطلاعات کاربر (در نسخه واقعی از جدول User استفاده می‌شود)
    const sessionsWithUserInfo = sessions.map(session => ({
      ...session,
      user: {
        name: `کاربر ${session.userId.slice(-4)}`, // شبیه‌سازی نام کاربر
        id: session.userId
      }
    }));

    return NextResponse.json({ 
      sessions: sessionsWithUserInfo,
      count: sessions.length
    });
  } catch (err: any) {
    console.error("Get therapist sessions failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}











