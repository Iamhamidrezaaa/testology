import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Note: mentalHealthProfile model is not in schema
    // const profile = await prisma.mentalHealthProfile.findUnique({ 
    //   where: { userId: session.user.id } 
    // })
    
    // if (!profile) {
    //   return new NextResponse('No mental health profile found', { status: 404 })
    // }
    
    const profile = null
    
    if (!profile) {
      return new NextResponse('Mental health profile feature is not available', { status: 404 })
    }

    // دریافت اطلاعات کاربر
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true }
    })

    // تولید PDF ساده (بدون pdf-lib برای سادگی)
    const pdfContent = generatePDFContent(profile, user)

    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=mental-health-analysis.pdf',
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

function generatePDFContent(profile: any, user: any): string {
  // تولید PDF ساده با HTML
  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <title>تحلیل روان‌شناسی - ${user?.name || 'کاربر'}</title>
        <style>
            body {
                font-family: 'Tahoma', 'Arial', sans-serif;
                line-height: 1.6;
                margin: 40px;
                color: #333;
                background: white;
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #3b82f6;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #3b82f6;
                font-size: 28px;
                margin: 0;
            }
            .header p {
                color: #666;
                font-size: 14px;
                margin: 5px 0;
            }
            .section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                background: #f9fafb;
            }
            .section h2 {
                color: #1f2937;
                font-size: 20px;
                margin-bottom: 15px;
                border-bottom: 2px solid #3b82f6;
                padding-bottom: 5px;
            }
            .section h3 {
                color: #374151;
                font-size: 16px;
                margin: 15px 0 10px 0;
            }
            .risk-level {
                display: inline-block;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                margin: 10px 0;
            }
            .risk-low { background: #dcfce7; color: #166534; }
            .risk-medium { background: #fef3c7; color: #92400e; }
            .risk-high { background: #fee2e2; color: #991b1b; }
            .stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }
            .stat-item {
                background: white;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                border: 1px solid #e5e7eb;
            }
            .stat-value {
                font-size: 24px;
                font-weight: bold;
                color: #3b82f6;
            }
            .stat-label {
                font-size: 12px;
                color: #666;
                margin-top: 5px;
            }
            .content {
                white-space: pre-wrap;
                line-height: 1.8;
                text-align: justify;
            }
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #666;
                font-size: 12px;
            }
            @media print {
                body { margin: 20px; }
                .section { break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🧠 تحلیل روان‌شناسی</h1>
            <p>نام: ${user?.name || 'کاربر ناشناس'}</p>
            <p>تاریخ تولید: ${new Date().toLocaleDateString('fa-IR')}</p>
        </div>

        <div class="section">
            <h2>📊 آمار کلی</h2>
            <div class="stats">
                <div class="stat-item">
                    <div class="stat-value">${profile.chartData?.length || 0}</div>
                    <div class="stat-label">روز تحلیل شده</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${profile.riskLevel || 'نامشخص'}</div>
                    <div class="stat-label">سطح ریسک</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${new Date(profile.createdAt).toLocaleDateString('fa-IR')}</div>
                    <div class="stat-label">تاریخ آخرین تحلیل</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>🤖 تحلیل ترکیبی هوش مصنوعی</h2>
            <div class="content">${profile.combinedReport}</div>
        </div>

        <div class="section">
            <h2>💡 پیشنهادات شخصی‌سازی شده</h2>
            <div class="content">${profile.recommendations}</div>
        </div>

        <div class="section">
            <h2>⚠️ سطح ریسک</h2>
            <div class="risk-level risk-${profile.riskLevel || 'medium'}">
                ${profile.riskLevel === 'low' ? 'کم' : 
                  profile.riskLevel === 'medium' ? 'متوسط' : 
                  profile.riskLevel === 'high' ? 'بالا' : 'نامشخص'}
            </div>
            <p>
                ${profile.riskLevel === 'low' ? 'وضعیت شما عالی است! ادامه دهید.' :
                  profile.riskLevel === 'medium' ? 'وضعیت شما قابل قبول است. مراقب باشید.' :
                  profile.riskLevel === 'high' ? 'توصیه می‌شود با متخصص مشورت کنید.' :
                  'لطفاً با متخصص مشورت کنید.'}
            </p>
        </div>

        <div class="footer">
            <p>این گزارش توسط سیستم Testology تولید شده است</p>
            <p>تاریخ تولید: ${new Date().toLocaleString('fa-IR')}</p>
            <p>⚠️ این گزارش صرفاً جنبه اطلاع‌رسانی دارد و جایگزین مشاوره تخصصی نیست</p>
        </div>
    </body>
    </html>
  `

  return htmlContent
}
















