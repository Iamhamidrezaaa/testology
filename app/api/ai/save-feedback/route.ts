import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { 
      userId, 
      clinicianId, 
      reportId, 
      feedbackType, 
      feedbackNote, 
      aiConfidence, 
      timeTaken 
    } = await req.json();

    if (!reportId || !feedbackType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const feedback = await prisma.humanFeedback.create({
      data: {
        userId,
        clinicianId,
        reportId,
        feedbackType,
        feedbackNote,
        aiConfidence,
        timeTaken,
      },
    });

    return NextResponse.json({ success: true, feedback });
  } catch (err: any) {
    console.error("Save feedback failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}











