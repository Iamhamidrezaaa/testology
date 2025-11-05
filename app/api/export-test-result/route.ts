import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { testName, score, analysis, testId, userId } = await req.json();

    // ایجاد PDF جدید
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // تنظیمات صفحه
    const { width, height } = page.getSize();
    const margin = 50;
    let yPosition = height - margin;

    // هدر
    page.drawText("تستولوژی - گزارش تست روان‌شناسی", {
      x: margin,
      y: yPosition,
      size: 20,
      font: boldFont,
      color: rgb(0.2, 0.4, 0.8),
    });
    yPosition -= 30;

    // خط جداکننده
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: width - margin, y: yPosition },
      thickness: 2,
      color: rgb(0.2, 0.4, 0.8),
    });
    yPosition -= 40;

    // اطلاعات تست
    page.drawText(`نام تست: ${testName}`, {
      x: margin,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 25;

    page.drawText(`تاریخ: ${new Date().toLocaleDateString('fa-IR')}`, {
      x: margin,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    yPosition -= 25;

    page.drawText(`کاربر: ${userId}`, {
      x: margin,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    yPosition -= 40;

    // نمره
    page.drawText("نتیجه تست:", {
      x: margin,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 30;

    page.drawText(`نمره شما: ${score}%`, {
      x: margin,
      y: yPosition,
      size: 18,
      font: boldFont,
      color: rgb(0.2, 0.4, 0.8),
    });
    yPosition -= 40;

    // تحلیل
    page.drawText("تحلیل نتایج:", {
      x: margin,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 30;

    // تقسیم متن تحلیل به خطوط
    const analysisLines = wrapText(analysis, 80);
    for (const line of analysisLines) {
      if (yPosition < 100) {
        // اگر فضا تمام شد، صفحه جدید اضافه کن
        const newPage = pdfDoc.addPage([595, 842]);
        yPosition = newPage.getSize().height - 50;
        page.drawText(line, {
          x: margin,
          y: yPosition,
          size: 12,
          font: font,
          color: rgb(0, 0, 0),
        });
      } else {
        page.drawText(line, {
          x: margin,
          y: yPosition,
          size: 12,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
      yPosition -= 20;
    }

    // فوتر
    yPosition = 50;
    page.drawText("تستولوژی - پلتفرم تست‌های روان‌شناسی", {
      x: margin,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // ذخیره PDF
    const pdfBytes = await pdfDoc.save();
    
    // بازگرداندن PDF
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="test-result-${testId}-${Date.now()}.pdf"`,
      },
    });

  } catch (error) {
    console.error("PDF Export Error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در تولید PDF" },
      { status: 500 }
    );
  }
}

function wrapText(text: string, maxLength: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        lines.push(word);
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}



