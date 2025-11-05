import React from 'react'
import Button from './Button'

interface DownloadPDFProps {
  filename: string
  contentRef: React.RefObject<HTMLDivElement>
  className?: string
}

export default function DownloadPDF({ 
  filename, 
  contentRef,
  className 
}: DownloadPDFProps) {
  const handleDownload = () => {
    if (!contentRef.current) return

    const opt = {
      margin: 0.5,
      filename: `${filename}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait'
      }
    }

    // @ts-ignore
    window.html2pdf().set(opt).from(contentRef.current).save()
  }

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      className={className}
      style={{ marginTop: '2rem' }}
    >
      <span style={{ marginLeft: '0.5rem' }}>📄</span>
      دانلود PDF
    </Button>
  )
} 