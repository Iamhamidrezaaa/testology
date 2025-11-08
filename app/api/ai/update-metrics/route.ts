import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const layers = ["Dream", "Recommendation", "Clinical", "Consensus", "Feedback"];
    
    for (const layer of layers) {
      const logs = await prisma.systemLog.findMany({
        where: { layer },
        orderBy: { createdAt: "desc" },
        take: 100,
      });

      if (logs.length === 0) continue;

      const avgLatency = logs.reduce((a, b) => a + (b.latencyMs || 0), 0) / logs.length;
      const successRate = logs.filter((l) => l.status === "success").length / logs.length;
      
      // محاسبه divergence بر اساس تنوع در latency
      const latencies = logs.map(l => l.latencyMs || 0);
      const mean = avgLatency;
      const variance = latencies.reduce((sum, lat) => sum + Math.pow(lat - mean, 2), 0) / latencies.length;
      const divergence = Math.sqrt(variance) / mean; // ضریب تغییرات

      await prisma.performanceMetric.upsert({
        where: { layer },
        update: { 
          avgLatencyMs: avgLatency, 
          successRate,
          divergence: isNaN(divergence) ? 0 : divergence
        },
        create: { 
          layer, 
          avgLatencyMs: avgLatency, 
          successRate,
          divergence: isNaN(divergence) ? 0 : divergence
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Performance metrics updated successfully" 
    });
  } catch (err: any) {
    console.error("Update metrics failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}











