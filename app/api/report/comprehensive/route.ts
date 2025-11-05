import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * API برای تولید گزارش جامع از تمام تست‌های کاربر
 * GET /api/report/comprehensive
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || session.user.id;

    // بررسی دسترسی
    if (userId !== session.user.id && session.user.role !== 'therapist' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // دریافت کاربر
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // دریافت تمام تست‌ها
    const testResults = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // دریافت پیشرفت
    const progress = await prisma.userProgress.findUnique({
      where: { userId }
    });

    // دریافت پروفایل سلامت روان
    const mentalHealthProfile = await prisma.mentalHealthProfile.findUnique({
      where: { userId }
    });

    // ایجاد PDF
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // صفحه اول - کاور
    let page = pdfDoc.addPage([595, 842]); // A4
    let { width, height } = page.getSize();
    let yPosition = height - 150;

    // عنوان اصلی
    page.drawText('COMPREHENSIVE', {
      x: width / 2 - 120,
      y: yPosition,
      size: 30,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.8),
    });

    yPosition -= 40;

    page.drawText('MENTAL HEALTH REPORT', {
      x: width / 2 - 140,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.8),
    });

    yPosition -= 80;

    page.drawText('Testology Psychology Platform', {
      x: width / 2 - 110,
      y: yPosition,
      size: 16,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    yPosition -= 100;

    // اطلاعات کاربر
    const userInfo = [
      `Name: ${user.name || 'N/A'}`,
      `Email: ${user.email || 'N/A'}`,
      `Member Since: ${new Date(user.createdAt).toLocaleDateString('en-US')}`,
      `Total Tests Completed: ${testResults.length}`,
      `Report Generated: ${new Date().toLocaleDateString('en-US')}`,
    ];

    userInfo.forEach((line) => {
      page.drawText(line, {
        x: 100,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
      yPosition -= 25;
    });

    // صفحه دوم - خلاصه
    page = pdfDoc.addPage([595, 842]);
    yPosition = height - 50;

    page.drawText('SUMMARY', {
      x: 50,
      y: yPosition,
      size: 20,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.8),
    });

    yPosition -= 30;

    // خط جداکننده
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 2,
      color: rgb(0.2, 0.2, 0.8),
    });

    yPosition -= 40;

    if (progress) {
      const progressInfo = [
        `Total XP Earned: ${progress.xp}`,
        `Current Level: ${progress.level}`,
        `Tests Completed: ${progress.totalTests}`,
        `Streak Days: ${progress.streakDays}`,
        `Achievements Unlocked: ${progress.achievements?.length || 0}`,
      ];

      progressInfo.forEach((line) => {
        page.drawText(line, {
          x: 70,
          y: yPosition,
          size: 12,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
        yPosition -= 22;
      });
    }

    yPosition -= 30;

    // تحلیل کلی
    if (mentalHealthProfile) {
      page.drawText('Overall Mental Health Profile', {
        x: 50,
        y: yPosition,
        size: 16,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });

      yPosition -= 25;

      page.drawText(`Risk Level: ${mentalHealthProfile.riskLevel || 'N/A'}`, {
        x: 70,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });

      yPosition -= 25;

      if (mentalHealthProfile.insights) {
        const insightLines = wrapText(mentalHealthProfile.insights, 70);
        insightLines.slice(0, 10).forEach((line) => {
          page.drawText(line, {
            x: 70,
            y: yPosition,
            size: 11,
            font,
            color: rgb(0.2, 0.2, 0.2),
          });
          yPosition -= 18;
        });
      }
    }

    // صفحات تست‌ها
    testResults.forEach((test, index) => {
      if (yPosition < 150) {
        page = pdfDoc.addPage([595, 842]);
        yPosition = height - 50;
      }

      page.drawText(`Test ${index + 1}: ${test.testName || test.testSlug}`, {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });

      yPosition -= 20;

      const testInfo = [
        `Date: ${new Date(test.createdAt).toLocaleDateString('en-US')}`,
        `Score: ${test.score !== null ? test.score.toFixed(2) : 'N/A'}`,
        `Severity: ${test.severity || 'N/A'}`,
      ];

      testInfo.forEach((line) => {
        page.drawText(line, {
          x: 70,
          y: yPosition,
          size: 11,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
        yPosition -= 18;
      });

      yPosition -= 10;
    });

    // تولید PDF
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="testology-comprehensive-report-${userId}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating comprehensive PDF:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

function wrapText(text: string, maxLength: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}
















