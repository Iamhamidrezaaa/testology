import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get("specialty");
    const verified = searchParams.get("verified");

    const whereClause: any = {};
    
    if (specialty) {
      whereClause.specialty = { contains: specialty, mode: "insensitive" };
    }
    
    if (verified !== null) {
      whereClause.verified = verified === "true";
    }

    const therapists = await prisma.humanTherapist.findMany({
      where: whereClause,
      orderBy: [
        { verified: "desc" },
        { name: "asc" }
      ]
    });

    // تبدیل availableSlots از JSON string به object
    const therapistsWithParsedSlots = therapists.map(therapist => ({
      ...therapist,
      availableSlots: therapist.availableSlots ? JSON.parse(therapist.availableSlots) : null
    }));

    return NextResponse.json({ 
      therapists: therapistsWithParsedSlots,
      count: therapists.length
    });
  } catch (err: any) {
    console.error("Get therapists failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}











