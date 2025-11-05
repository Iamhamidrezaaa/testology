import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withMonitoring } from "@/middleware/withMonitoring";

async function bookSessionHandler(req: Request) {
  try {
    const { userId, type, therapistId, date, timeSlot, mode } = await req.json();
    
    if (!userId || !type || !date || !timeSlot) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // اعتبارسنجی نوع جلسه
    if (!["AI", "HUMAN"].includes(type)) {
      return NextResponse.json({ error: "Invalid session type" }, { status: 400 });
    }

    // برای جلسات انسانی، therapistId الزامی است
    if (type === "HUMAN" && !therapistId) {
      return NextResponse.json({ error: "Therapist ID required for human sessions" }, { status: 400 });
    }

    // بررسی وجود درمانگر (برای جلسات انسانی)
    if (type === "HUMAN" && therapistId) {
      const therapist = await prisma.humanTherapist.findUnique({
        where: { id: therapistId, verified: true }
      });
      
      if (!therapist) {
        return NextResponse.json({ error: "Therapist not found or not verified" }, { status: 404 });
      }
    }

    // بررسی تداخل زمان (برای جلسات انسانی)
    if (type === "HUMAN") {
      const existingBooking = await prisma.sessionBooking.findFirst({
        where: {
          therapistId,
          date: new Date(date),
          timeSlot,
          confirmed: true
        }
      });

      if (existingBooking) {
        return NextResponse.json({ error: "Time slot already booked" }, { status: 409 });
      }
    }

    // ایجاد رزرو
    const booking = await prisma.sessionBooking.create({
      data: {
        userId,
        type,
        therapistId: therapistId || null,
        date: new Date(date),
        timeSlot,
        mode: mode || "online",
        confirmed: type === "AI" ? true : false, // جلسات AI فوراً تأیید می‌شوند
      },
    });

    return NextResponse.json({ 
      success: true, 
      booking,
      message: type === "AI" 
        ? "جلسه با درمانگر مجازی رزرو شد" 
        : "درخواست رزرو جلسه با درمانگر انسانی ثبت شد"
    });
  } catch (err: any) {
    console.error("Booking failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export const POST = withMonitoring(bookSessionHandler, "Booking");











