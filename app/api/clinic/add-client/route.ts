import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { clinicianId, nickname, gender, birthYear } = await req.json();
    
    if (!clinicianId || !nickname) {
      return NextResponse.json({ 
        success: false,
        error: "Missing required fields: clinicianId and nickname" 
      }, { status: 400 });
    }

    console.log(`🏥 افزودن مراجع جدید برای روان‌شناس ${clinicianId}...`);

    // Client model doesn't exist in schema
    // Returning error for now
    return NextResponse.json({ 
      success: false,
      error: "Client model is not in schema",
      message: "این قابلیت در حال حاضر در دسترس نیست"
    }, { status: 400 });

  } catch (err) {
    console.error("❌ خطا در افزودن مراجع:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در افزودن مراجع"
    }, { status: 500 });
  }
}











