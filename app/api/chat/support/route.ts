import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

const SUPPORT_SYSTEM = `تو دستیار پشتیبانی Testology هستی. راهنمای صفحات، لینک‌های تست‌ها، و پاسخ‌های سریع بده.
اگر سوال بالینی است، محترمانه به چت‌بات روان‌شناس ارجاع بده. پاسخ مختصر و لینک‌دار (internal) بده.`;

export async function POST(req: NextRequest) {
  try {
    const { userId, messages = [] } = await req.json();

    if (Array.isArray(messages) && messages.length > 0) {
      // ذخیره همه پیام‌ها در یک رکورد به صورت JSON
      await prisma.chatHistory.create({
        data: {
          userId: userId || null,
          messages: JSON.stringify({
            channel: "support",
            messages: messages.map((m: any) => ({
              role: m.role || "user",
              content: m.content || "",
              timestamp: new Date().toISOString()
            }))
          })
        }
      });
    }

    const r = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: SUPPORT_SYSTEM }, ...messages],
        temperature: 0.4,
      }),
    });

    const data = await r.json();
    const answer = data.choices?.[0]?.message?.content || "…";

    await prisma.chatHistory.create({
      data: {
        userId: userId || null,
        messages: JSON.stringify({
          channel: "support",
          role: "assistant",
          content: answer,
          timestamp: new Date().toISOString()
        })
      },
    });

    return NextResponse.json({ reply: answer });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "error" }, { status: 500 });
  }
}


