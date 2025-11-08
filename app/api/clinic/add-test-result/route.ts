import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { clientId, testName, score, summary } = await req.json();
    
    if (!clientId || !testName || score === undefined) {
      return NextResponse.json({ 
        success: false,
        error: "Missing required fields: clientId, testName, and score" 
      }, { status: 400 });
    }

    console.log(`📊 افزودن نتیجه تست ${testName} برای مراجع ${clientId}...`);

    // ClientTestResult model doesn't exist in schema
    return NextResponse.json({ 
      success: false,
      error: "ClientTestResult model is not in schema",
      message: "این قابلیت در حال حاضر در دسترس نیست"
    }, { status: 400 });

  } catch (err) {
    console.error("❌ خطا در افزودن نتیجه تست:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در افزودن نتیجه تست"
    }, { status: 500 });
  }
}











