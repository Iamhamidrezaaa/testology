import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // جلوگیری از SSG
export const revalidate = 0;
export const runtime = "nodejs"; // مطمئن شو روی Node اجرا میشه، نه Edge

/**
 * مسیر سروری برای دریافت کشور کاربر بر اساس IP
 * این فایل در محیط Node.js اجرا می‌شود، نه Edge
 */
export async function GET(req: Request) {
  try {
    // Lazy import برای جلوگیری از خواندن فایل .dat در زمان build
    const geoip = (await import("geoip-lite")).default;

    // IP واقعی را از هدر پراکسی/کدی به دست میاریم، fallback برای تست:
    const ip =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "8.8.8.8";

    const info = geoip.lookup(ip);

    return NextResponse.json(
      info ?? { country: "Unknown", region: "Unknown", city: "Unknown" }
    );
  } catch (err) {
    console.error("geoip error:", err);
    return NextResponse.json(
      { error: "geoip failed" },
      { status: 500 }
    );
  }
}










