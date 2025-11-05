import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const result = await prisma.clientTestResult.create({
      data: { 
        clientId, 
        testName, 
        score: parseFloat(score), 
        summary 
      },
    });

    console.log(`✅ نتیجه تست ${testName} با موفقیت اضافه شد`);

    return NextResponse.json({ 
      success: true, 
      result,
      message: `نتیجه تست ${testName} با موفقیت اضافه شد`
    });

  } catch (err) {
    console.error("❌ خطا در افزودن نتیجه تست:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در افزودن نتیجه تست"
    }, { status: 500 });
  }
}











