import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini"; // سبک، سریع، مناسب چت

export async function POST(req: NextRequest) {
  try {
    const { userId, messages = [] } = await req.json();

    console.log("🔍 API Key check:", process.env.OPENAI_API_KEY ? "✅ موجود" : "❌ موجود نیست");
    console.log("📝 Messages:", messages);

    // ایمنی: همیشه پیام‌ها را ذخیره کنیم
    if (Array.isArray(messages) && messages.length > 0) {
      try {
        // ذخیره همه پیام‌ها در یک رکورد به صورت JSON
        await prisma.chatHistory.create({
          data: {
            userId: userId || null,
            messages: JSON.stringify({
              channel: "psychologist",
              messages: messages.map((m: any) => ({
                role: m.role || "user",
                content: m.content || "",
                timestamp: new Date().toISOString()
              }))
            })
          }
        });
      } catch (dbError) {
        console.log("⚠️ Database error:", dbError);
        // ادامه می‌دهیم حتی اگر DB کار نکنه
      }
    }

    // بررسی API Key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: "API Key not found", 
        reply: "متأسفانه کلید API تنظیم نشده است. لطفاً با مدیر سیستم تماس بگیرید." 
      }, { status: 500 });
    }

    // فراخوانی OpenAI
    const r = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "تو یک روان‌شناس بالینی همدل هستی. پاسخ‌ها: کوتاه، همدلانه، بدون تشخیص قطعی. در پایان هر پیام یک پرسش باز هم بده."},
          ...messages,
        ],
        temperature: 0.7,
      }),
    });

    console.log("🌐 OpenAI Response Status:", r.status);

    if (!r.ok) {
      const t = await r.text();
      console.log("❌ OpenAI Error:", t);
      return NextResponse.json({ 
        error: "openai_error", 
        detail: t,
        reply: "متأسفانه در حال حاضر نمی‌توانم پاسخ دهم. لطفاً دوباره تلاش کنید."
      }, { status: 500 });
    }

    const data = await r.json();
    const answer = data.choices?.[0]?.message?.content || "متأسفانه نمی‌توانم پاسخ دهم.";

    console.log("✅ OpenAI Response:", answer);

    // ذخیره پاسخ
    try {
      await prisma.chatHistory.create({
        data: {
          userId: userId || null,
          messages: JSON.stringify({
            channel: "psychologist",
            role: "assistant",
            content: answer,
            timestamp: new Date().toISOString()
          })
        },
      });
    } catch (dbError) {
      console.log("⚠️ Database save error:", dbError);
    }

    return NextResponse.json({ reply: answer });
  } catch (e: any) {
    console.log("💥 General Error:", e);
    return NextResponse.json({ 
      error: e?.message || "error",
      reply: "متأسفانه خطایی رخ داده است. لطفاً دوباره تلاش کنید."
    }, { status: 500 });
  }
}
