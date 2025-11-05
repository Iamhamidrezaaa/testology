import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PDFDocument from 'pdfkit'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'therapist') {
    return new Response(JSON.stringify({ error: 'دسترسی غیرمجاز' }), { status: 403 })
  }

  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId الزامی است' }), { status: 400 })
    }

    // بررسی اینکه کاربر متعلق به این مشاور است
    const isOwnClient = await prisma.user.count({ 
      where: { id: userId, assignedTherapistId: session.user.id } 
    })
    
    if (!isOwnClient) {
      return new Response(JSON.stringify({ error: 'این کاربر به شما اختصاص ندارد' }), { status: 403 })
    }

    // دریافت اطلاعات کاربر و نتایج تست‌ها
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        firstName: true,
        lastName: true,
        gender: true,
        country: true,
        birthDate: true,
        email: true,
        phone: true,
        testResults: {
          orderBy: { createdAt: 'desc' },
          select: {
            testName: true,
            testSlug: true,
            type: true,
            score: true,
            totalScore: true,
            result: true,
            completed: true,
            createdAt: true,
            extraData: true
          }
        }
      }
    })

    if (!user) {
      return new Response(JSON.stringify({ error: 'کاربر یافت نشد' }), { status: 404 })
    }

    // ایجاد PDF
    const doc = new PDFDocument({ margin: 50 })
    
    // تنظیم هدر برای دانلود
    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Disposition', `attachment; filename="Testology_Report_${user.name || 'User'}_${new Date().toISOString().split('T')[0]}.pdf"`)

    const stream = new ReadableStream({
      start(controller) {
        doc.on('data', (chunk) => controller.enqueue(chunk))
        doc.on('end', () => controller.close())
        doc.on('error', (err) => controller.error(err))
      }
    })

    // محتوای PDF
    doc.fontSize(20).text('📄 Testology - گزارش وضعیت روانی', { align: 'center' })
    doc.moveDown(1)

    // اطلاعات کاربر
    doc.fontSize(16).text('👤 مشخصات کاربر', { underline: true })
    doc.moveDown(0.5)
    
    doc.fontSize(12)
    doc.text(`نام: ${user.name || user.firstName + ' ' + user.lastName || 'نامشخص'}`)
    doc.text(`جنسیت: ${user.gender || 'نامشخص'}`)
    doc.text(`کشور: ${user.country || 'نامشخص'}`)
    doc.text(`تاریخ تولد: ${user.birthDate ? new Date(user.birthDate).toLocaleDateString('fa-IR') : 'نامشخص'}`)
    doc.text(`ایمیل: ${user.email || 'نامشخص'}`)
    doc.text(`تلفن: ${user.phone || 'نامشخص'}`)
    doc.text(`تاریخ تولید گزارش: ${new Date().toLocaleDateString('fa-IR')}`)
    doc.moveDown(1)

    // نتایج تست‌ها
    if (user.testResults.length > 0) {
      doc.fontSize(16).text('🧠 نتایج تست‌های روان‌شناختی', { underline: true })
      doc.moveDown(0.5)

      user.testResults.forEach((test, index) => {
        doc.fontSize(14).text(`${index + 1}. ${test.testName}`, { underline: true })
        doc.fontSize(11)
        doc.text(`نوع تست: ${test.type}`)
        doc.text(`نمره: ${test.score !== null ? `${test.score}${test.totalScore ? `/${test.totalScore}` : ''}` : 'نامشخص'}`)
        doc.text(`وضعیت: ${test.completed ? 'تکمیل شده' : 'ناتمام'}`)
        doc.text(`تاریخ انجام: ${new Date(test.createdAt).toLocaleDateString('fa-IR')}`)
        
        if (test.result) {
          doc.text(`تحلیل: ${test.result.slice(0, 200)}${test.result.length > 200 ? '...' : ''}`)
        }
        
        doc.moveDown(0.5)
      })
    } else {
      doc.fontSize(14).fillColor('red').text('⚠️ هیچ تستی توسط این کاربر انجام نشده است.')
    }

    doc.moveDown(1)
    doc.fontSize(10).fillColor('gray').text('این گزارش توسط سیستم Testology تولید شده است.', { align: 'center' })
    doc.fillColor('gray').text(`شماره گزارش: ${Date.now()}`, { align: 'center' })

    doc.end()

    return new Response(stream, { headers })
  } catch (error) {
    console.error('generate-report error:', error)
    return new Response(JSON.stringify({ error: 'خطای داخلی سرور' }), { status: 500 })
  }
}


