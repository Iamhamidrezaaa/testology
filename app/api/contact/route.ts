import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log("📩 پیام جدید از فرم تماس:", data);
  return NextResponse.json({ ok: true });
}


