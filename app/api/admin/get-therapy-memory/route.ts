import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const memory = await prisma.therapyMemory.findUnique({ 
      where: { userId } 
    });

    if (!memory) {
      return NextResponse.json({ 
        memory: null,
        message: "No therapy memory found for this user"
      });
    }

    // تبدیل emotionTags از JSON string به array
    const memoryWithParsedTags = {
      ...memory,
      emotionTags: JSON.parse(memory.emotionTags || "[]")
    };

    return NextResponse.json({ memory: memoryWithParsedTags });
  } catch (err: any) {
    console.error("Get therapy memory failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}











