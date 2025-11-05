'use client'
import jsPDF from 'jspdf'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns-jalali'

interface PDFDownloadProps {
  testName: string
  score: number
  analysis: string
  combinedAnalysis?: string
}

export function PDFDownload({ 
  testName, 
  score, 
  analysis, 
  combinedAnalysis 
}: PDFDownloadProps) {
  const handleDownload = () => {
    const doc = new jsPDF()
    
    // تنظیم فونت فارسی
    doc.setFont('helvetica')
    
    // هدر
    doc.setFontSize(20)
    doc.text('گزارش تست روان‌شناسی', 105, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.text(`تست: ${testName}`, 20, 35)
    doc.text(`امتیاز: ${score}`, 20, 45)
    doc.text(`تاریخ: ${format(new Date(), 'yyyy/MM/dd')}`, 20, 55)
    
    // خط جداکننده
    doc.line(20, 65, 190, 65)
    
    // تحلیل اصلی
    doc.setFontSize(14)
    doc.text('تحلیل روان‌شناسی:', 20, 80)
    
    doc.setFontSize(10)
    const analysisLines = doc.splitTextToSize(analysis, 170)
    doc.text(analysisLines, 20, 90)
    
    let yPosition = 90 + (analysisLines.length * 5) + 10
    
    // تحلیل ترکیبی
    if (combinedAnalysis) {
      doc.setFontSize(14)
      doc.text('تحلیل ترکیبی:', 20, yPosition)
      
      doc.setFontSize(10)
      const combinedLines = doc.splitTextToSize(combinedAnalysis, 170)
      doc.text(combinedLines, 20, yPosition + 10)
      
      yPosition += 10 + (combinedLines.length * 5) + 10
    }
    
    // فوتر
    doc.setFontSize(8)
    doc.text('این گزارش توسط Testology تولید شده است.', 105, yPosition + 20, { align: 'center' })
    doc.text('برای اطلاعات بیشتر به testology.com مراجعه کنید.', 105, yPosition + 30, { align: 'center' })
    
    // ذخیره فایل
    doc.save(`گزارش-${testName}-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
  }

  return (
    <Button 
      onClick={handleDownload}
      variant="outline"
      className="flex items-center space-x-2"
    >
      📄 دانلود PDF
    </Button>
  )
}

















