import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validation
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "ایمیل معتبر وارد کنید" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existing) {
      // اگر وجود دارد و غیرفعال است، فعالش کن
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { email: email.toLowerCase() },
          data: { isActive: true, unsubscribedAt: null }
        });
        return NextResponse.json({
          success: true,
          message: "با موفقیت در خبرنامه عضو شدید"
        });
      }
      return NextResponse.json(
        { error: "این ایمیل قبلاً عضو خبرنامه شده است" },
        { status: 400 }
      );
    }

    // Add to newsletter
    await prisma.newsletterSubscriber.create({
      data: {
        email: email.toLowerCase(),
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "با موفقیت در خبرنامه عضو شدید"
    });

  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    
    return NextResponse.json(
      { error: "خطا در عضویت در خبرنامه" },
      { status: 500 }
    );
  }
}

// Get newsletter stats (for admin)
export async function GET() {
  try {
    const total = await prisma.newsletterSubscriber.count();
    const active = await prisma.newsletterSubscriber.count({
      where: { isActive: true }
    });
    
    const recentSubscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      orderBy: { subscribedAt: 'desc' },
      take: 10
    });

    return NextResponse.json({
      totalSubscribers: total,
      recentSubscribers: recentSubscribers.map(sub => ({
        id: sub.id,
        email: sub.email,
        subscribedAt: sub.subscribedAt,
        isActive: sub.isActive
      }))
    });

  } catch (error: any) {
    console.error("Newsletter stats error:", error);
    console.error("Error stack:", error?.stack);
    console.error("Error message:", error?.message);
    return NextResponse.json(
      { error: error?.message || "خطا در دریافت آمار" },
      { status: 500 }
    );
  }
}
