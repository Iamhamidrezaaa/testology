import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    // ClientClinicalNote model doesn't exist in schema
    return NextResponse.json({ 
      success: false,
      error: "ClientClinicalNote model is not in schema",
      message: "این قابلیت در حال حاضر در دسترس نیست"
    }, { status: 400 });

  } catch (err) {
    console.error("❌ خطا در بروزرسانی یادداشت بالینی:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در بروزرسانی یادداشت بالینی"
    }, { status: 500 });
  }
}











