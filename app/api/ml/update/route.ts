import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const acc = (Math.random() * 0.1 + 0.85).toFixed(3);
  const loss = (Math.random() * 0.05 + 0.02).toFixed(3);

  await prisma.learningMetric.create({
    data: { modelName: "Testology Core", accuracy: parseFloat(acc), loss: parseFloat(loss) },
  });

  return NextResponse.json({ status: "ok", accuracy: acc, loss });
}


