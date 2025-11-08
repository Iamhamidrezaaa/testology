import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import jsPDF from 'jspdf'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const advisorId = searchParams.get('advisorId')

    if (!userId || !advisorId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // بررسی دسترسی
    if (session.user.role !== 'ADMIN' && session.user.id !== advisorId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // SessionNote model doesn't exist in schema
    // Returning empty array for now
    const notes: any[] = []

    if (notes.length === 0) {
      return NextResponse.json({ error: 'No notes found' }, { status: 404 })
    }

    // ایجاد PDF
    const doc = new jsPDF()
    
    // تنظیم فونت
    doc.setFont('helvetica')
    
    // هدر
    doc.setFontSize(20)
    doc.text('گزارش یادداشت‌های جلسات مشاوره', 105, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.text(`مشاور: -`, 20, 35)
    doc.text(`کاربر: -`, 20, 45)
    doc.text(`تاریخ تولید: ${new Date().toLocaleDateString('fa-IR')}`, 20, 55)
    
    // خط جداکننده
    doc.line(20, 65, 190, 65)
    
    let yPosition = 80
    
    // یادداشت‌ها - SessionNote model doesn't exist
    notes.forEach((note: any, index: number) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }
      
      doc.setFontSize(14)
      doc.text(`یادداشت ${index + 1}:`, 20, yPosition)
      
      doc.setFontSize(10)
      doc.text(`تاریخ: ${note.createdAt ? new Date(note.createdAt).toLocaleDateString('fa-IR') : '-'}`, 20, yPosition + 10)
      
      doc.setFontSize(12)
      const contentLines = doc.splitTextToSize(note.content || '', 170)
      doc.text(contentLines, 20, yPosition + 20)
      
      yPosition += 20 + (contentLines.length * 5) + 15
    })
    
    // فوتر
    doc.setFontSize(8)
    doc.text('این گزارش توسط Testology تولید شده است.', 105, yPosition + 20, { align: 'center' })
    
    // تبدیل به buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="session-notes-${userId}-${new Date().toISOString().split('T')[0]}.pdf"`
      }
    })

  } catch (error) {
    console.error('Error exporting notes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















