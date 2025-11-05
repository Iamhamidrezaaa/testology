import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const result = await prisma.testResult.findUnique({
      where: { id: params.id },
    });

    if (!result) {
      return NextResponse.json({ error: "Test result not found" }, { status: 404 });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // هدر گزارش
    page.drawText("Testology - گزارش تحلیل تست", { 
      x: 50, 
      y: 780, 
      size: 18, 
      font: boldFont,
      color: rgb(0.2, 0.4, 0.8)
    });

    // اطلاعات تست
    page.drawText(`نام تست: ${result.testName}`, { 
      x: 50, 
      y: 740, 
      size: 12, 
      font: boldFont 
    });
    
    page.drawText(`امتیاز: ${result.score ?? "—"}`, { 
      x: 50, 
      y: 720, 
      size: 12, 
      font: font 
    });
    
    page.drawText(`تاریخ انجام: ${new Date(result.createdAt).toLocaleDateString("fa-IR")}`, { 
      x: 50, 
      y: 700, 
      size: 12, 
      font: font 
    });

    // عنوان تحلیل
    page.drawText("تحلیل هوشمند:", { 
      x: 50, 
      y: 680, 
      size: 14, 
      font: boldFont,
      color: rgb(0.2, 0.4, 0.8)
    });

    // تحلیل GPT
    const analysis = result.analysis || "تحلیل موجود نیست.";
    const lines = analysis.match(/.{1,90}/g) || [analysis];
    let y = 650;
    
    lines.forEach((line) => {
      if (y < 50) {
        // اگر فضای کافی نیست، صفحه جدید اضافه کن
        const newPage = pdfDoc.addPage([595, 842]);
        y = 800;
      }
      page.drawText(line, { 
        x: 50, 
        y, 
        size: 10, 
        font, 
        color: rgb(0, 0, 0) 
      });
      y -= 15;
    });

    // فوتر
    const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
    lastPage.drawText("تولید شده توسط Testology - پلتفرم ارزیابی و بهبود مهارت‌ها", { 
      x: 50, 
      y: 30, 
      size: 8, 
      font, 
      color: rgb(0.5, 0.5, 0.5) 
    });

    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${result.testName}-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Error:", error);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}



