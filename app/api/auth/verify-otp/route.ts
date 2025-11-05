import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Email و Code الزامی است." }, { status: 400 });
    }

    // پیدا کردن کد معتبر (مصرف‌نشده و منقضی‌نشده)
    const otp = await prisma.oTP.findFirst({
      where: {
        identifier: email,
        code: String(code),
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otp) {
      return NextResponse.json({ error: "کد اشتباه یا منقضی شده است." }, { status: 400 });
    }

    // علامت‌گذاری به‌عنوان مصرف‌شده
    await prisma.oTP.update({
      where: { id: otp.id },
      data: { used: true },
    });

    // کاربر را پیدا/ایجاد کن
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0],
          role: email === "h.asgarizade@gmail.com" ? "ADMIN" : "USER",
        },
      });
    }

    // ساخت توکن JWT سشن
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "7d" }
    );

    // ست‌کردن کوکی HttpOnly
    const response = NextResponse.json({ ok: true, redirect: "/dashboard" });
    response.cookies.set({
      name: "testology_token",
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 روز
    });

    return response;
  } catch (err) {
    console.error("verify-otp error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}