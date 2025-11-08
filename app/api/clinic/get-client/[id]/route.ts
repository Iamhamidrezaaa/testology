import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id;
    
    if (!clientId) {
      return NextResponse.json({ 
        success: false,
        error: "Missing client ID" 
      }, { status: 400 });
    }

    console.log(`👤 دریافت اطلاعات مراجع ${clientId}...`);

    // Client model doesn't exist in schema
    return NextResponse.json({ 
      success: false,
      error: "Client model is not in schema",
      message: "این قابلیت در حال حاضر در دسترس نیست"
    }, { status: 400 });

  } catch (err) {
    console.error("❌ خطا در دریافت اطلاعات مراجع:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در دریافت اطلاعات مراجع"
    }, { status: 500 });
  }
}











