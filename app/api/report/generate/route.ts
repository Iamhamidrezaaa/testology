import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import PDFDocument from 'pdfkit'

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // دریافت اطلاعات کاربر
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        image: true
      }
    })

    // دریافت نتایج تست‌ها
    const testResults = await prisma.testResult.findMany({
      where: { userId, completed: true },
      orderBy: { createdAt: 'desc' }
    })

    // دریافت تمرین‌های هفتگی
    const weeklyAssignments = await prisma.weeklyAssignment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    // دریافت ورودی‌های احساسات
    const moodEntries = await prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30
    })

    // دریافت پیشرفت کاربر
    const userProgress = await prisma.userProgress.findUnique({
      where: { userId }
    })

    // دریافت تحلیل روان‌شناسی
    const mentalHealthProfile = await prisma.mentalHealthProfile.findUnique({
      where: { userId }
    })

    // دریافت ویدئوهای کاربر
    const videoLogs = await prisma.videoLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // ایجاد PDF
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: 'گزارش روان‌شناسی Testology',
        Author: 'Testology Platform',
        Subject: 'گزارش کامل وضعیت روان‌شناختی کاربر'
      }
    })

    const buffers: Buffer[] = []
    doc.on('data', (chunk) => buffers.push(chunk))
    
    // استفاده از await برای Promise
    const pdfResponse = await new Promise<NextResponse>((resolve, reject) => {
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers)
        resolve(new NextResponse(pdfData, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=testology-report.pdf',
            'Cache-Control': 'no-cache'
          }
        }))
      })
      
      doc.on('error', (error) => {
        reject(error)
      })

      // شروع تولید PDF
      generatePDFContent(doc, {
        user,
        testResults,
        weeklyAssignments,
        moodEntries,
        userProgress,
        mentalHealthProfile,
        videoLogs
      })
    })
    
    return pdfResponse

  } catch (error) {
    console.error('Error generating PDF report:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generatePDFContent(doc: PDFDocument, data: any) {
  const { user, testResults, weeklyAssignments, moodEntries, userProgress, mentalHealthProfile, videoLogs } = data

  // هدر گزارش
  doc.fontSize(24)
    .fillColor('#3b82f6')
    .text('🧠 گزارش روان‌شناسی Testology', { align: 'center' })
  
  doc.moveDown(2)

  // اطلاعات کاربر
  doc.fontSize(16)
    .fillColor('#1f2937')
    .text('👤 اطلاعات کاربر', { underline: true })
  
  doc.fontSize(12)
    .fillColor('#374151')
    .text(`نام: ${user?.name || 'نامشخص'}`)
    .text(`ایمیل: ${user?.email || 'نامشخص'}`)
    .text(`تاریخ تولید گزارش: ${new Date().toLocaleDateString('fa-IR')}`)
  
  doc.moveDown(1)

  // پیشرفت کاربر
  if (userProgress) {
    doc.fontSize(16)
      .fillColor('#1f2937')
      .text('📊 پیشرفت کاربر', { underline: true })
    
    doc.fontSize(12)
      .fillColor('#374151')
      .text(`سطح: ${userProgress.level}`)
      .text(`امتیاز XP: ${userProgress.xp}`)
      .text(`تست‌های انجام شده: ${userProgress.totalTests}`)
      .text(`دستاوردها: ${userProgress.achievements.length}`)
    
    doc.moveDown(1)
  }

  // نتایج تست‌ها
  if (testResults.length > 0) {
    doc.fontSize(16)
      .fillColor('#1f2937')
      .text('🧠 نتایج تست‌های روان‌شناسی', { underline: true })
    
    testResults.forEach((test, index) => {
      doc.fontSize(12)
        .fillColor('#374151')
        .text(`${index + 1}. ${test.testName}`)
        .text(`   امتیاز: ${test.score}`)
        .text(`   تاریخ: ${test.createdAt.toLocaleDateString('fa-IR')}`)
        .text(`   نتیجه: ${test.resultText}`)
        .moveDown(0.5)
    })
    
    doc.moveDown(1)
  }

  // تمرین‌های هفتگی
  if (weeklyAssignments.length > 0) {
    doc.fontSize(16)
      .fillColor('#1f2937')
      .text('📦 تمرین‌های هفتگی', { underline: true })
    
    const completedAssignments = weeklyAssignments.filter(a => a.status === 'completed')
    const inProgressAssignments = weeklyAssignments.filter(a => a.status === 'in_progress')
    
    doc.fontSize(12)
      .fillColor('#374151')
      .text(`کل تمرین‌ها: ${weeklyAssignments.length}`)
      .text(`تکمیل شده: ${completedAssignments.length}`)
      .text(`در حال انجام: ${inProgressAssignments.length}`)
    
    doc.moveDown(0.5)
    
    weeklyAssignments.slice(0, 10).forEach((assignment, index) => {
      doc.text(`${index + 1}. ${assignment.title}`)
        .text(`   وضعیت: ${assignment.status}`)
        .text(`   هفته: ${assignment.week} - ${assignment.year}`)
        .moveDown(0.3)
    })
    
    doc.moveDown(1)
  }

  // ورودی‌های احساسات
  if (moodEntries.length > 0) {
    doc.fontSize(16)
      .fillColor('#1f2937')
      .text('😊 ورودی‌های احساسات', { underline: true })
    
    const moodCounts = moodEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    doc.fontSize(12)
      .fillColor('#374151')
      .text(`کل ورودی‌ها: ${moodEntries.length}`)
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      doc.text(`${mood}: ${count} بار`)
    })
    
    doc.moveDown(1)
  }

  // تحلیل روان‌شناسی
  if (mentalHealthProfile) {
    doc.fontSize(16)
      .fillColor('#1f2937')
      .text('🤖 تحلیل روان‌شناسی', { underline: true })
    
    doc.fontSize(12)
      .fillColor('#374151')
      .text(`سطح ریسک: ${mentalHealthProfile.riskLevel}`)
      .moveDown(0.5)
    
    if (mentalHealthProfile.combinedReport) {
      doc.text('تحلیل ترکیبی:')
        .moveDown(0.3)
      
      // تقسیم متن طولانی به خطوط
      const reportLines = mentalHealthProfile.combinedReport.split('\n')
      reportLines.forEach(line => {
        if (line.length > 80) {
          const words = line.split(' ')
          let currentLine = ''
          words.forEach(word => {
            if ((currentLine + word).length > 80) {
              doc.text(currentLine.trim())
              currentLine = word + ' '
            } else {
              currentLine += word + ' '
            }
          })
          if (currentLine.trim()) {
            doc.text(currentLine.trim())
          }
        } else {
          doc.text(line)
        }
      })
    }
    
    doc.moveDown(1)
  }

  // ویدئوهای کاربر
  if (videoLogs.length > 0) {
    doc.fontSize(16)
      .fillColor('#1f2937')
      .text('🎥 ویدئوهای ضبط شده', { underline: true })
    
    doc.fontSize(12)
      .fillColor('#374151')
      .text(`کل ویدئوها: ${videoLogs.length}`)
    
    videoLogs.slice(0, 5).forEach((video, index) => {
      doc.text(`${index + 1}. هفته ${video.week} - ${video.year}`)
        .text(`   تاریخ: ${video.createdAt.toLocaleDateString('fa-IR')}`)
        .text(`   احساس: ${video.mood || 'نامشخص'}`)
      if (video.caption) {
        doc.text(`   توضیحات: ${video.caption}`)
      }
      doc.moveDown(0.3)
    })
    
    doc.moveDown(1)
  }

  // خلاصه و توصیه‌ها
  doc.fontSize(16)
    .fillColor('#1f2937')
    .text('📋 خلاصه و توصیه‌ها', { underline: true })
  
  doc.fontSize(12)
    .fillColor('#374151')
    .text('• ادامه انجام تست‌های منظم برای ارزیابی وضعیت روانی')
    .text('• ثبت روزانه احساسات برای بهبود خودآگاهی')
    .text('• انجام تمرین‌های هفتگی اختصاص داده شده')
    .text('• ضبط ویدئوهای شخصی برای ثبت پیشرفت')
    .text('• مشاوره با متخصص در صورت نیاز')
  
  doc.moveDown(2)

  // فوتر
  doc.fontSize(10)
    .fillColor('#6b7280')
    .text('این گزارش توسط پلتفرم Testology تولید شده است', { align: 'center' })
    .text(`تاریخ تولید: ${new Date().toLocaleString('fa-IR')}`, { align: 'center' })
    .text('⚠️ این گزارش صرفاً جنبه اطلاع‌رسانی دارد و جایگزین مشاوره تخصصی نیست', { align: 'center' })

  // پایان PDF
  doc.end()
}














