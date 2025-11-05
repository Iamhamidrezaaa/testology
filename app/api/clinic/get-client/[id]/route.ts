import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id;
    
    if (!clientId) {
      return NextResponse.json({ 
        success: false,
        error: "Missing client ID" 
      }, { status: 400 });
    }

    console.log(`👤 دریافت اطلاعات مراجع ${clientId}...`);

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        testResults: {
          orderBy: { createdAt: "desc" },
          take: 5
        },
        clinicalNotes: {
          orderBy: { createdAt: "desc" },
          take: 3
        }
      }
    });

    if (!client) {
      return NextResponse.json({ 
        success: false,
        error: "مراجع یافت نشد" 
      }, { status: 404 });
    }

    console.log(`✅ اطلاعات مراجع ${client.nickname} دریافت شد`);

    return NextResponse.json({ 
      success: true,
      client,
      message: `اطلاعات مراجع ${client.nickname} دریافت شد`
    });

  } catch (err) {
    console.error("❌ خطا در دریافت اطلاعات مراجع:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در دریافت اطلاعات مراجع"
    }, { status: 500 });
  }
}











