import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const therapistId = searchParams.get("therapistId");
    
    if (!therapistId) {
      return NextResponse.json({ error: "Missing therapistId" }, { status: 400 });
    }

    // TherapistEarnings, SessionBooking, and Payment models don't exist in schema
    const earnings = null;
    const totalSessions = 0;
    const thisMonthSessions = 0;
    const thisMonthEarnings = { _sum: { amount: 0 } };

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











