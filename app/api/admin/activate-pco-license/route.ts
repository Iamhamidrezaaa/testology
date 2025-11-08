import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { licenseNumber, description } = await req.json();
    
    if (!licenseNumber) {
      return NextResponse.json({ 
        success: false,
        error: "Missing required field: licenseNumber" 
      }, { status: 400 });
    }

    console.log(`🔏 فعال‌سازی مجوز رسمی PCO: ${licenseNumber}...`);

    // فعال‌سازی مجوز PCO
    const pcoLicense = await prisma.systemConfig.upsert({
      where: { key: "pco_license" },
      update: { 
        value: "ACTIVE",
        description: description || `Official PCO License for Testology Clinical Reports - ${licenseNumber}`,
        updatedAt: new Date()
      },
      create: { 
        key: "pco_license",
        value: "ACTIVE",
        description: description || `Official PCO License for Testology Clinical Reports - ${licenseNumber}`
      },
    });

    // ذخیره شماره مجوز
    const licenseNumberConfig = await prisma.systemConfig.upsert({
      where: { key: "pco_license_number" },
      update: { 
        value: licenseNumber,
        description: "Official PCO License Number",
        updatedAt: new Date()
      },
      create: { 
        key: "pco_license_number",
        value: licenseNumber,
        description: "Official PCO License Number"
      },
    });

    // ذخیره تاریخ فعال‌سازی
    const activationDate = await prisma.systemConfig.upsert({
      where: { key: "pco_activation_date" },
      update: { 
        value: new Date().toISOString(),
        description: "PCO License Activation Date",
        updatedAt: new Date()
      },
      create: { 
        key: "pco_activation_date",
        value: new Date().toISOString(),
        description: "PCO License Activation Date"
      },
    });

    console.log("✅ مجوز رسمی PCO با موفقیت فعال شد");

    return NextResponse.json({ 
      success: true,
      pcoLicense,
      licenseNumber: licenseNumberConfig,
      activationDate,
      message: "مجوز رسمی PCO با موفقیت فعال شد"
    });

  } catch (err) {
    console.error("❌ خطا در فعال‌سازی مجوز PCO:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در فعال‌سازی مجوز PCO"
    }, { status: 500 });
  }
}

// غیرفعال‌سازی مجوز PCO
export async function DELETE() {
  try {
    console.log("🔏 غیرفعال‌سازی مجوز رسمی PCO...");

    await prisma.systemConfig.update({
      where: { key: "pco_license" },
      data: { 
        value: "INACTIVE",
        description: "PCO License Deactivated",
        updatedAt: new Date()
      },
    });

    console.log("✅ مجوز رسمی PCO با موفقیت غیرفعال شد");

    return NextResponse.json({ 
      success: true,
      message: "مجوز رسمی PCO با موفقیت غیرفعال شد"
    });

  } catch (err) {
    console.error("❌ خطا در غیرفعال‌سازی مجوز PCO:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در غیرفعال‌سازی مجوز PCO"
    }, { status: 500 });
  }
}











