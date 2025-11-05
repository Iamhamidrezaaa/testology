import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = params.id;
    
    if (!reportId) {
      return NextResponse.json({ 
        success: false,
        error: "Missing report ID" 
      }, { status: 400 });
    }

    console.log(`🔍 اعتبارسنجی گزارش ${reportId}...`);

    // دریافت گزارش از دیتابیس
    const report = await prisma.clinicalReport.findUnique({ 
      where: { id: reportId } 
    });

    if (!report) {
      return NextResponse.json({ 
        success: false,
        valid: false, 
        message: "گزارش یافت نشد" 
      });
    }

    // بررسی وجود امضای دیجیتال
    if (!report.digitalSignature || !report.versionCode) {
      return NextResponse.json({
        success: true,
        valid: false,
        message: "گزارش فاقد امضای دیجیتال است",
        version: report.versionCode,
        createdAt: report.createdAt,
        pcoCertified: false
      });
    }

    // بررسی وضعیت مجوز PCO
    const license = await prisma.systemConfig.findUnique({ 
      where: { key: "pco_license" } 
    });
    const pcoCertified = license?.value === "ACTIVE";

    // اعتبارسنجی امضای دیجیتال
    let isValid = false;
    
    try {
      const publicKeyPath = path.join(process.cwd(), "keys", "public.pem");
      
      if (fs.existsSync(publicKeyPath)) {
        const publicKey = fs.readFileSync(publicKeyPath, "utf8");
        const verify = crypto.createVerify("RSA-SHA256");
        verify.update(report.summary + report.versionCode);
        verify.end();
        isValid = verify.verify(publicKey, report.digitalSignature, "base64");
      } else {
        // در صورت عدم وجود کلید عمومی، بررسی ساده انجام می‌دهیم
        const expectedSignature = crypto.createHash("sha256")
          .update(report.summary + report.versionCode)
          .digest("base64");
        isValid = report.digitalSignature === expectedSignature;
      }
    } catch (error) {
      console.error("خطا در اعتبارسنجی امضا:", error);
      isValid = false;
    }

    console.log(`✅ اعتبارسنجی تکمیل شد - معتبر: ${isValid}`);

    return NextResponse.json({
      success: true,
      valid: isValid,
      version: report.versionCode,
      createdAt: report.createdAt,
      pcoCertified,
      reportId: report.id,
      message: isValid ? "گزارش معتبر است" : "گزارش نامعتبر است"
    });

  } catch (err) {
    console.error("❌ خطا در اعتبارسنجی:", err);
    return NextResponse.json({ 
      success: false,
      valid: false,
      error: String(err),
      message: "خطا در اعتبارسنجی"
    }, { status: 500 });
  }
}











