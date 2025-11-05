import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const { noteId, clinicianNote, verified } = await req.json();
    
    if (!noteId) {
      return NextResponse.json({ 
        success: false,
        error: "Missing required field: noteId" 
      }, { status: 400 });
    }

    console.log(`📝 بروزرسانی یادداشت بالینی ${noteId}...`);

    const updated = await prisma.clientClinicalNote.update({
      where: { id: noteId },
      data: { 
        clinicianNote, 
        verified: verified || false 
      },
    });

    console.log("✅ یادداشت بالینی با موفقیت بروزرسانی شد");

    return NextResponse.json({ 
      success: true, 
      updated,
      message: "یادداشت بالینی با موفقیت بروزرسانی شد"
    });

  } catch (err) {
    console.error("❌ خطا در بروزرسانی یادداشت بالینی:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در بروزرسانی یادداشت بالینی"
    }, { status: 500 });
  }
}











