import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // دریافت جلسات فردا
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);
    dayAfter.setHours(0, 0, 0, 0);

    const sessions = await prisma.sessionBooking.findMany({
      where: {
        date: {
          gte: tomorrow,
          lt: dayAfter
        },
        confirmed: true
      },
      include: {
        // در آینده می‌توان therapist را نیز include کرد
      }
    });

    const reminders = [];

    for (const session of sessions) {
      const reminder = {
        sessionId: session.id,
        userId: session.userId,
        type: session.type,
        date: session.date,
        timeSlot: session.timeSlot,
        mode: session.mode,
        message: session.type === "AI" 
          ? "یادآوری: جلسه با درمانگر مجازی فردا در ساعت " + session.timeSlot
          : "یادآوری: جلسه با درمانگر انسانی فردا در ساعت " + session.timeSlot
      };
      
      reminders.push(reminder);
      
      // در آینده: ارسال نوتیف واقعی
      console.log(`📅 Reminder: ${reminder.message} (User: ${session.userId})`);
    }

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











