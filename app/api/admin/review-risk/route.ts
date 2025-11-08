import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const { riskId } = await req.json();
    
    if (!riskId) {
      return NextResponse.json({ 
        success: false,
        error: "Missing required field: riskId" 
      }, { status: 400 });
    }

    console.log(`✅ بررسی ریسک ${riskId} توسط انسان...`);

    await prisma.riskFlag.update({
      where: { id: riskId },
      data: { humanReviewed: true },
    });

    console.log("✅ ریسک با موفقیت بررسی شد");

    return NextResponse.json({ 
      success: true,
      message: "ریسک با موفقیت بررسی شد"
    });

  } catch (err) {
    console.error("❌ خطا در بررسی ریسک:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در بررسی ریسک"
    }, { status: 500 });
  }
}











