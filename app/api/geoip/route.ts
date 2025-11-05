import { NextResponse } from "next/server";
import geoip from "geoip-lite";

/**
 * مسیر سروری برای دریافت کشور کاربر بر اساس IP
 * این فایل در محیط Node.js اجرا می‌شود، نه Edge
 */
export async function GET(req: Request) {
  try {
    const ip =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "8.8.8.8"; // پیش‌فرض برای تست

    const geo = geoip.lookup(ip);

    return NextResponse.json(
      geo || {
        country: "Unknown",
        region: "Unknown",
        city: "Unknown",
      }
    );
  } catch (error) {
    console.error('GeoIP error:', error);
    return NextResponse.json(
      {
        country: "Unknown",
        region: "Unknown", 
        city: "Unknown",
        error: "Failed to detect location"
      },
      { status: 500 }
    );
  }
}










