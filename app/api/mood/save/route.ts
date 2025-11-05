import { NextRequest, NextResponse } from "next/server";
// اگر جدول mood داری وصلش کن؛ فعلاً لاگ می‌کنیم
export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("mood_save", body);
  return NextResponse.json({ ok: true });
}


