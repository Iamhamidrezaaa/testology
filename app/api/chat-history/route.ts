import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    
    // برای دمو، از userId ثابت استفاده می‌کنیم
    const userId = "demo-user";

    const history = await prisma.chatHistory.findMany({
      where: {
        userId: userId,
        ...(type !== "all" ? { chatType: type } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(history);
  } catch (err) {
    console.error("Chat history error:", err);
    return NextResponse.json([], { status: 500 });
  }
}



