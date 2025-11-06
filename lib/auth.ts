import { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { randomInt } from "crypto";
import nodemailer from "nodemailer";

// 📩 ساخت ترنسپورتر برای ارسال ایمیل از طریق تنظیمات محیطی
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// ✉️ تابع ارسال Magic Link یا OTP
async function sendVerificationRequest({ identifier, url, token, provider }: {
  identifier: string;
  url: string;
  token: string;
  provider: any;
}) {
  // چک کن آیا کاربر جدید است یا خیر
  const user = await prisma.user.findUnique({ where: { email: identifier } });
  let subject, html;

  if (!user) {
    // مرحله اول: کاربر تازه ثبت‌نام می‌کند - Magic Link
    subject = "فعال‌سازی حساب کاربری شما در تستولوژی";
    html = `
      <p>سلام! 🎉</p>
      <p>برای فعال‌سازی حساب خود در <b>تستولوژی</b> روی لینک زیر کلیک کنید:</p>
      <p><a href="${url}">${url}</a></p>
      <p>اگر شما این درخواست را نداده‌اید، لطفاً این ایمیل را نادیده بگیرید.</p>
    `;
  } else {
    // مرحله دوم: ورود با OTP
    const otp = String(randomInt(10000, 99999)); // عدد ۵ رقمی
    await prisma.oTP.create({
      data: {
        identifier,
        code: otp,
        mode: "email",
        expiresAt: new Date(Date.now() + 2 * 60 * 1000), // ۲ دقیقه اعتبار
      },
    });
    subject = "کد ورود شما به تستولوژی 🔐";
    html = `
      <p>سلام دوباره 👋</p>
      <p>کد ورود شما به تستولوژی:</p>
      <h2 style="font-size: 24px; letter-spacing: 8px;">${otp}</h2>
      <p>این کد تا ۲ دقیقه معتبر است.</p>
    `;
  }

  const result = await transporter.sendMail({
    to: identifier,
    from: process.env.EMAIL_FROM as string,
    subject,
    html,
  });

  if (!result.accepted.length) throw new Error("Failed to send the email");
}

// 🎯 پیکربندی اصلی NextAuth
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      maxAge: 10 * 60, // Magic Link valid for 10 minutes
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
    CredentialsProvider({
      name: "otp",
      credentials: {
        email: { label: "ایمیل", type: "email" },
        password: { label: "کد OTP", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // چک کردن OTP در دیتابیس
        const otpRecord = await prisma.oTP.findFirst({
          where: {
            identifier: credentials.email,
            code: credentials.password,
            mode: 'email',
            expiresAt: {
              gt: new Date()
            }
          }
        });

        if (!otpRecord) {
          return null;
        }

        // پیدا کردن کاربر
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          return null;
        }

        // حذف OTP استفاده شده
        await prisma.oTP.delete({
          where: { id: otpRecord.id }
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  pages: {
    // صفحه ورود اختصاصی
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.email) {
        const user = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (user) {
          session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role as string,
            phone: user.phone || undefined,
            isAdmin: user.role === 'ADMIN'
          };
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.email = user.email;
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
