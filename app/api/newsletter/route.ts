import { NextRequest, NextResponse } from "next/server";
import { newsletterStorage } from "@/lib/newsletter-storage";

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
    if (newsletterStorage.emailExists(email)) {
      return NextResponse.json(
        { error: "این ایمیل قبلاً عضو خبرنامه شده است" },
        { status: 400 }
      );
    }

    // Add to newsletter
    newsletterStorage.addSubscriber(email);

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
    const stats = newsletterStorage.getStats();
    const recentSubscribers = newsletterStorage.getRecentSubscribers(10);

    return NextResponse.json({
      totalSubscribers: stats.total,
      recentSubscribers
    });

  } catch (error) {
    console.error("Newsletter stats error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت آمار" },
      { status: 500 }
    );
  }
}
