import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const metrics = await prisma.performanceMetric.findMany({
      orderBy: { updatedAt: "desc" }
    });
    
    // Get recent logs for additional context
    const recentLogs = await prisma.systemLog.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    return NextResponse.json({ 
      metrics,
      recentLogs,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}











