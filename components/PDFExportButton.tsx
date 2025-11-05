"use client";

import { useState } from "react";
import { Download } from "lucide-react";

interface PDFExportButtonProps {
  userId: string;
  type: 'chat-history' | 'test-results' | 'custom';
  content?: string;
  className?: string;
}

export default function PDFExportButton({ 
  userId, 
  type, 
  content, 
  className = "" 
}: PDFExportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function exportPDF() {
    setLoading(true);
    
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          type,
          content
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // دانلود فایل PDF
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = `testology_report_${type}_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('خطا در ایجاد گزارش PDF');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('خطا در ایجاد گزارش PDF');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={exportPDF}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 ${className}`}
    >
      <Download size={16} />
      {loading ? 'در حال ایجاد...' : 'دانلود PDF'}
    </button>
  );
}



