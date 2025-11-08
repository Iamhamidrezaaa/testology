import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const feedbacks = await prisma.humanFeedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }).catch(() => []);
    return NextResponse.json({ feedbacks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}











