import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { userId, type, content } = await req.json();
    
    // ایجاد PDF جدید
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: 'گزارش تستولوژی',
        Author: 'Testology Platform',
        Subject: 'گزارش تست روان‌شناسی',
        Creator: 'Testology AI'
      }
    });

    // تنظیم فونت فارسی (اگر در دسترس باشد)
    doc.font('Helvetica');

    // هدر گزارش
    doc.fontSize(20)
       .fillColor('#4F46E5')
       .text('🧠 گزارش تستولوژی', 50, 50, { align: 'center' });

    doc.fontSize(12)
       .fillColor('#666')
       .text(`تاریخ: ${new Date().toLocaleDateString('fa-IR')}`, 50, 100);

    // محتوای گزارش
    if (type === 'chat-history') {
      // دریافت تاریخچه چت
      const chatHistory = await prisma.chatHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      doc.fontSize(16)
         .fillColor('#000')
         .text('📚 تاریخچه گفتگوها', 50, 130);

      let yPosition = 160;
      
      chatHistory.forEach((msg, index) => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }

        const role = msg.role === 'user' ? 'کاربر' : 'روان‌شناس';
        const timestamp = new Date(msg.createdAt).toLocaleString('fa-IR');
        
        doc.fontSize(10)
           .fillColor('#666')
           .text(`${role} - ${timestamp}`, 50, yPosition);
        
        yPosition += 20;
        
        doc.fontSize(12)
           .fillColor('#000')
           .text(msg.message, 50, yPosition, {
             width: 500,
             align: msg.role === 'user' ? 'right' : 'left'
           });
        
        yPosition += 40;
      });
    }

    if (type === 'test-results') {
      // دریافت نتایج تست‌ها
      const testResults = await prisma.testResult.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      doc.fontSize(16)
         .fillColor('#000')
         .text('📊 نتایج تست‌های روان‌شناسی', 50, 130);

      let yPosition = 160;
      
      testResults.forEach((result, index) => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }

        doc.fontSize(14)
           .fillColor('#4F46E5')
           .text(`${index + 1}. ${result.testName}`, 50, yPosition);
        
        yPosition += 25;
        
        doc.fontSize(12)
           .fillColor('#000')
           .text(`نمره: ${result.score}`, 50, yPosition);
        
        yPosition += 20;
        
        doc.text(`نتیجه: ${result.result}`, 50, yPosition);
        
        yPosition += 20;
        
        if (result.analysis) {
          doc.text(`تحلیل: ${result.analysis}`, 50, yPosition, {
            width: 500
          });
          yPosition += 40;
        }
        
        yPosition += 20;
      });
    }

    if (type === 'custom') {
      // محتوای سفارشی
      doc.fontSize(16)
         .fillColor('#000')
         .text('📄 گزارش سفارشی', 50, 130);

      doc.fontSize(12)
         .fillColor('#000')
         .text(content || 'محتوای گزارش', 50, 160, {
           width: 500
         });
    }

    // فوتر
    doc.fontSize(10)
       .fillColor('#999')
       .text('تولید شده توسط Testology - پلتفرم هوشمند روان‌شناسی', 50, 750, { align: 'center' });

    // ذخیره فایل PDF
    const fileName = `testology_report_${Date.now()}.pdf`;
    const filePath = path.join(process.cwd(), 'public', fileName);
    
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    doc.end();

    return new Promise((resolve) => {
      stream.on('finish', () => {
        resolve(NextResponse.json({ 
          success: true, 
          downloadUrl: `/${fileName}`,
          message: 'گزارش PDF با موفقیت ایجاد شد'
        }));
      });
    });

  } catch (error) {
    console.error('PDF Export Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطا در ایجاد گزارش PDF' 
    }, { status: 500 });
  }
}



