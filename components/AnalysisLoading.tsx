import React from 'react'

interface AnalysisLoadingProps {
  message?: string
}

export default function AnalysisLoading({ 
  message = 'تحلیل دقیق روان‌شناختی شما در حال آماده‌سازی است...' 
}: AnalysisLoadingProps) {
  return (
    <div className="analysis-loading">
      <p>{message}</p>
      <div className="dot-loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
} 