import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ results: [] });
    }

    const results = await prisma.testResult.findMany({
      where: {
        user: { email: session.user.email },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        testName: true,
        testId: true,
        score: true,
        result: true,
        analysis: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("❌ Error fetching results:", error);
    return NextResponse.json({ results: [] });
  }
}



