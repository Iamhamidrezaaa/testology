import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withMonitoring } from "@/middleware/withMonitoring";
import { sendBookingConfirmation, sendTherapistNotification } from "@/lib/sms";

async function processPaymentHandler(req: Request) {
  try {
    const { userId, therapistId, bookingId, amount } = await req.json();

    if (!userId || !therapistId || !bookingId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // بررسی وجود جلسه
    const booking = await prisma.sessionBooking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.confirmed) {
      return NextResponse.json({ error: "Session already confirmed" }, { status: 409 });
    }

    // شبیه‌سازی پرداخت (در نسخه واقعی به درگاه پرداخت وصل می‌شود)
    const transactionId = `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // ثبت پرداخت در دیتابیس
    const payment = await prisma.payment.create({
      data: {
        userId,
        therapistId,
        bookingId,
        amount: parseFloat(amount),
        status: "paid",
        transactionId,
      },
    });

    // به‌روزرسانی درآمد درمانگر
    await prisma.therapistEarnings.upsert({
      where: { therapistId },
      update: { 
        totalEarned: { increment: parseFloat(amount) },
        pending: { increment: parseFloat(amount) }
      },
      create: { 
        therapistId, 
        totalEarned: parseFloat(amount),
        pending: parseFloat(amount)
      },
    });

    // تأیید جلسه
    await prisma.sessionBooking.update({
      where: { id: bookingId },
      data: { confirmed: true },
    });

    // ارسال پیامک تأیید به کاربر و درمانگر
    await sendBookingConfirmation(
      userId, 
      "درمانگر Testology", 
      booking.date.toLocaleDateString('fa-IR'), 
      booking.timeSlot
    );
    
    await sendTherapistNotification(
      therapistId,
      `کاربر ${userId.slice(-4)}`,
      booking.date.toLocaleDateString('fa-IR'),
      booking.timeSlot
    );

    return NextResponse.json({ 
      success: true, 
      payment,
      message: "پرداخت با موفقیت انجام شد و جلسه تأیید شد",
      transactionId
    });
  } catch (err: any) {
    console.error("Payment processing failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export const POST = withMonitoring(processPaymentHandler, "Payment");
