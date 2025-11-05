import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { userId, messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.text || "";

    // 🧬 دریافت اطلاعات کاربر و تست‌هایش
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { testResults: true },
    });

    // آماده‌سازی خلاصه تست‌های کاربر
    const testsSummary = user?.testResults
      ?.map((t) => `${t.testName}: نمره ${t.score} — ${t.result}`)
      .join("\n") || "کاربر هنوز هیچ تستی انجام نداده است.";

    // ثبت پیام کاربر در دیتابیس
    await prisma.chatHistory.create({
      data: {
        userId,
        chatType: "psychologist",
        role: "user",
        message: lastUserMessage,
      },
    });

    // 🧠 ساخت پرامپت شخصی‌سازی‌شده
    const prompt = `
    تو روان‌شناس هوشمند تستولوژی هستی.
    پاسخ‌هایت را بر اساس داده‌های تست‌های روان‌شناسی کاربر تنظیم کن.
    در پاسخ از لحن مهربان، ساده و صمیمی استفاده کن.
    
    اطلاعات کاربر:
    ${testsSummary}

    پیام کاربر:
    "${lastUserMessage}"
    
    پاسخ بده با در نظر گرفتن شخصیت و وضعیت روانی او:
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.8,
      max_tokens: 220,
    });

    const reply = completion.choices[0].message?.content || "الان نمی‌تونم پاسخ بدم.";

    // ثبت پاسخ در دیتابیس
    await prisma.chatHistory.create({
      data: {
        userId,
        chatType: "psychologist",
        role: "bot",
        message: reply,
      },
    });

    // 🎧 تبدیل پاسخ به صدا
    const ttsRes = await client.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: reply,
    });

    const fileName = `tts_${Date.now()}.mp3`;
    const filePath = path.join(process.cwd(), "public", fileName);
    const buffer = Buffer.from(await ttsRes.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ reply, audioUrl: `/${fileName}` });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ reply: "مشکلی پیش آمد." }, { status: 500 });
  }
}
