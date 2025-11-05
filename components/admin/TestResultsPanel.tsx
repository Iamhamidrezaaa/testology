'use client'

import { useState } from 'react'
import { TestResult } from '@/types/test'

interface TestResultsPanelProps {
  initialResults: TestResult[]
}

export default function TestResultsPanel({ initialResults }: TestResultsPanelProps) {
  const [results, setResults] = useState(initialResults)
  const [loading, setLoading] = useState(false)
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null)

  const handleViewDetails = (result: TestResult) => {
    setSelectedResult(result)
  }

  const handleCloseDetails = () => {
    setSelectedResult(null)
  }

  return (
    <div className="space-y-8">
      {/* لیست نتایج */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">نتایج تست‌ها</h2>
        <div className="space-y-4">
          {results.map(result => (
            <div key={result.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {result.userId} - {result.testId}
                  </h3>
                  <p className="text-gray-600">
                    امتیاز: {result.score}
                  </p>
                  <p className="text-gray-600">
                    تاریخ: {new Date(result.createdAt).toLocaleString('fa-IR')}
                  </p>
                </div>
                <button
                  onClick={() => handleViewDetails(result)}
                  className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700"
                >
                  مشاهده جزئیات
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* نمایش جزئیات نتیجه */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">جزئیات نتیجه تست</h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">اطلاعات کاربر</h3>
                <p>شناسه کاربر: {selectedResult.userId}</p>
              </div>
              <div>
                <h3 className="font-semibold">اطلاعات تست</h3>
                <p>شناسه تست: {selectedResult.testId}</p>
                <p>امتیاز: {selectedResult.score}</p>
                <p>تاریخ: {new Date(selectedResult.createdAt).toLocaleString('fa-IR')}</p>
              </div>
              <div>
                <h3 className="font-semibold">پاسخ‌ها</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                  {JSON.stringify(selectedResult.answers, null, 2)}
                </pre>
              </div>
              {selectedResult.analysis && (
                <div>
                  <h3 className="font-semibold">تحلیل</h3>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    {JSON.stringify(selectedResult.analysis, null, 2)}
                  </pre>
                </div>
              )}
              {selectedResult.recommendations && (
                <div>
                  <h3 className="font-semibold">توصیه‌ها</h3>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    {JSON.stringify(selectedResult.recommendations, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 