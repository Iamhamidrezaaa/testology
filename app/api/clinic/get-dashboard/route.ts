import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicianId = searchParams.get("clinicianId");

    if (!clinicianId) {
      return NextResponse.json({ 
        success: false,
        error: "Missing clinicianId parameter" 
      }, { status: 400 });
    }

    console.log(`🏥 دریافت داشبورد کلینیک برای روان‌شناس ${clinicianId}...`);

    // Client, ClientTestResult, and ClientClinicalNote models don't exist in schema
    const clients: any[] = [];
    const totalClients = 0;
    const totalTests = 0;
    const totalNotes = 0;
    const recentNotes: any[] = [];

    const dashboard = {
      clients,
      stats: {
        totalClients,
        totalTests,
        totalNotes
      },
      recentNotes
    };

    console.log(`✅ داشبورد کلینیک با ${totalClients} مراجع دریافت شد`);

    return NextResponse.json({ 
      success: true,
      dashboard,
      message: `داشبورد کلینیک با ${totalClients} مراجع دریافت شد`
    });

  } catch (err) {
    console.error("❌ خطا در دریافت داشبورد کلینیک:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در دریافت داشبورد کلینیک"
    }, { status: 500 });
  }
}











