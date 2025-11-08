import { NextResponse } from "next/server";
import { getOpenAIClient } from '@/lib/openai-client';




export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const last = messages[messages.length - 1]?.text || "";

    const prompt = `
    تو دستیار پشتیبانی سایت "تستولوژی" هستی.
    پاسخ‌ها باید کوتاه، صمیمی و کاربردی باشن.
    هدف: کمک به کاربران برای فهمیدن مسیر استفاده از تست‌ها، مشکلات فنی یا راهنمایی عمومی.
    متن کاربر: """${last}"""
    پاسخ بده به فارسی طبیعی و دوستانه:
    `;

    const client = getOpenAIClient();
    if (!client) {
      return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.7,
      max_tokens: 120,
    });

    const reply = completion.choices[0].message?.content || "فعلاً نمی‌تونم پاسخ بدم 😅";

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Support Chat Error:", err);
    return NextResponse.json({ reply: "مشکلی پیش آمده، بعداً دوباره امتحان کنید." }, { status: 500 });
  }
}
