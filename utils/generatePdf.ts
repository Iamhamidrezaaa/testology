import jsPDF from 'jspdf'

type TestData = {
  mbtiType: string
  analysis: string
  createdAt: string
}

export function generateTestPdf(test: TestData) {
  const doc = new jsPDF()
  
  // تنظیم فونت و جهت متن
  doc.setFont('Arial')
  doc.setR2L(true)
  
  // اضافه کردن عنوان
  doc.setFontSize(20)
  doc.text('تحلیل تست شخصیت', 200, 20, { align: 'center' })
  
  // اضافه کردن اطلاعات تست
  doc.setFontSize(12)
  doc.text(`تاریخ: ${new Date(test.createdAt).toLocaleDateString('fa-IR')}`, 190, 40)
  doc.text(`تیپ شخصیت: ${test.mbtiType}`, 190, 50)
  
  // اضافه کردن تحلیل
  doc.setFontSize(14)
  doc.text('تحلیل:', 190, 70)
  doc.setFontSize(12)
  
  // تقسیم متن تحلیل به خطوط
  const splitText = doc.splitTextToSize(test.analysis, 180)
  doc.text(splitText, 190, 80)
  
  // ذخیره فایل
  doc.save(`Testology-${test.mbtiType}.pdf`)
} 
