import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get("specialty");
    const verified = searchParams.get("verified");

    // مدل humanTherapist در schema وجود ندارد
    // برای MVP، لیست خالی برمی‌گردانیم
    return NextResponse.json({ 
      therapists: [],
      count: 0
    });
  } catch (err: any) {
    console.error("Get therapists failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}











