import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // دریافت مراجعان
    const clients = await prisma.client.findMany({
      where: { clinicianId },
      include: {
        testResults: {
          orderBy: { createdAt: "desc" },
          take: 3
        },
        clinicalNotes: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // آمار کلی
    const totalClients = clients.length;
    const totalTests = await prisma.clientTestResult.count({
      where: { 
        client: { clinicianId } 
      }
    });
    const totalNotes = await prisma.clientClinicalNote.count({
      where: { clinicianId }
    });

    // گزارش‌های اخیر
    const recentNotes = await prisma.clientClinicalNote.findMany({
      where: { clinicianId },
      include: {
        client: true
      },
      orderBy: { createdAt: "desc" },
      take: 5
    });

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











