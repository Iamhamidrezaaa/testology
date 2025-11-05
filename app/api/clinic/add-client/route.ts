import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const client = await prisma.client.create({
      data: { 
        clinicianId, 
        nickname, 
        gender, 
        birthYear: birthYear ? parseInt(birthYear) : null 
      },
    });

    console.log(`✅ مراجع ${nickname} با موفقیت اضافه شد`);

    return NextResponse.json({ 
      success: true, 
      client,
      message: `مراجع ${nickname} با موفقیت اضافه شد`
    });

  } catch (err) {
    console.error("❌ خطا در افزودن مراجع:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در افزودن مراجع"
    }, { status: 500 });
  }
}











