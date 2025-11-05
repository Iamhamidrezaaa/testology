import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// دریافت تنظیمات سیستم
export async function GET() {
  try {
    console.log("⚙️ دریافت تنظیمات سیستم...");

    const configs = await prisma.systemConfig.findMany({
      orderBy: { key: "asc" }
    });

    console.log(`✅ ${configs.length} تنظیمات دریافت شد`);

    return NextResponse.json({ 
      success: true,
      configs,
      message: `${configs.length} تنظیمات دریافت شد`
    });

  } catch (err) {
    console.error("❌ خطا در دریافت تنظیمات:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در دریافت تنظیمات"
    }, { status: 500 });
  }
}

// بروزرسانی یا ایجاد تنظیمات
export async function POST(req: Request) {
  try {
    const { key, value, description } = await req.json();
    
    if (!key || value === undefined) {
      return NextResponse.json({ 
        success: false,
        error: "Missing required fields: key and value" 
      }, { status: 400 });
    }

    console.log(`⚙️ بروزرسانی تنظیمات ${key}...`);

    const config = await prisma.systemConfig.upsert({
      where: { key },
      update: { 
        value, 
        description,
        updatedAt: new Date()
      },
      create: { 
        key, 
        value, 
        description 
      },
    });

    console.log(`✅ تنظیمات ${key} با موفقیت بروزرسانی شد`);

    return NextResponse.json({ 
      success: true, 
      config,
      message: `تنظیمات ${key} با موفقیت بروزرسانی شد`
    });

  } catch (err) {
    console.error("❌ خطا در بروزرسانی تنظیمات:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در بروزرسانی تنظیمات"
    }, { status: 500 });
  }
}

// حذف تنظیمات
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    
    if (!key) {
      return NextResponse.json({ 
        success: false,
        error: "Missing key parameter" 
      }, { status: 400 });
    }

    console.log(`⚙️ حذف تنظیمات ${key}...`);

    await prisma.systemConfig.delete({
      where: { key }
    });

    console.log(`✅ تنظیمات ${key} با موفقیت حذف شد`);

    return NextResponse.json({ 
      success: true,
      message: `تنظیمات ${key} با موفقیت حذف شد`
    });

  } catch (err) {
    console.error("❌ خطا در حذف تنظیمات:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در حذف تنظیمات"
    }, { status: 500 });
  }
}











