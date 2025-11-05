import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const therapistId = searchParams.get("therapistId");
    
    if (!therapistId) {
      return NextResponse.json({ error: "Missing therapistId" }, { status: 400 });
    }

    // دریافت اطلاعات درآمد
    const earnings = await prisma.therapistEarnings.findUnique({
      where: { therapistId }
    });

    // دریافت آمار جلسات
    const totalSessions = await prisma.sessionBooking.count({
      where: { 
        therapistId,
        type: "HUMAN",
        confirmed: true
      }
    });

    const thisMonthSessions = await prisma.sessionBooking.count({
      where: { 
        therapistId,
        type: "HUMAN",
        confirmed: true,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    // محاسبه درآمد این ماه
    const thisMonthEarnings = await prisma.payment.aggregate({
      where: {
        therapistId,
        status: "paid",
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: {
        amount: true
      }
    });

    return NextResponse.json({ 
      earnings: earnings || {
        therapistId,
        totalEarned: 0,
        pending: 0
      },
      stats: {
        totalSessions,
        thisMonthSessions,
        thisMonthEarnings: thisMonthEarnings._sum.amount || 0
      }
    });
  } catch (err: any) {
    console.error("Get therapist earnings failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}











