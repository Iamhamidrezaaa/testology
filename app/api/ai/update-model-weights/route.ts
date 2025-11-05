import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withMonitoring } from "@/middleware/withMonitoring";

/**
 * Called when a clinician confirms or rejects a consensus report.
 * feedback = "approved" | "revised"
 */
async function updateWeightsHandler(req: Request) {
  try {
    const { modelsUsed, feedback, confidence, clinicianId, reportId, feedbackNote, timeTaken } = await req.json();

    if (!modelsUsed || !Array.isArray(modelsUsed) || !feedback) {
      return NextResponse.json({ error: "Missing feedback" }, { status: 400 });
    }

    // Save human feedback first
    if (reportId) {
      await prisma.humanFeedback.create({
        data: {
          userId: null,
          clinicianId,
          reportId,
          feedbackType: feedback,
          feedbackNote,
          aiConfidence: confidence,
          timeTaken,
        },
      });
    }

    // محاسبه ضریب بازخورد انسانی معتبر
    const feedbacks = await prisma.humanFeedback.findMany({
      where: { 
        clinicianId: clinicianId ? { equals: clinicianId } : { not: null },
        feedbackScore: { not: null }
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const reliability = feedbacks.length > 0 
      ? feedbacks.reduce((sum, f) => sum + (f.reliability || 0.5), 0) / feedbacks.length
      : 0.5;

    const deltaBase = feedback === "approved" ? 0.05 : -0.05;
    const conf = typeof confidence === "number" ? confidence : 0.8;
    const effectiveDelta = deltaBase * conf * reliability; // تاثیر بازخورد معتبرتر

    for (const modelName of modelsUsed) {
      const existing = await prisma.modelWeight.findUnique({ where: { modelName } });
      if (existing) {
        const newWeight = Math.min(1, Math.max(0, existing.weight + effectiveDelta));
        await prisma.modelWeight.update({
          where: { modelName },
          data: { weight: newWeight, accuracy: existing.accuracy ?? conf },
        });
      } else {
        await prisma.modelWeight.create({
          data: {
            modelName,
            weight: feedback === "approved" ? 0.6 : 0.4,
            accuracy: conf,
          },
        });
      }
    }

    return NextResponse.json({ success: true, reliability });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export const POST = withMonitoring(updateWeightsHandler, "Feedback");
