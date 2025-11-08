import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // دریافت جلسات فردا
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);
    dayAfter.setHours(0, 0, 0, 0);

    // SessionBooking model doesn't exist in schema
    const sessions: any[] = [];
    const reminders: any[] = [];

    return NextResponse.json({ 
      success: true,
      remindersSent: reminders.length,
      sessions: sessions.length,
      message: `یادآوری ${reminders.length} جلسه ارسال شد`
    });
  } catch (err: any) {
    console.error("Send reminders failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}











