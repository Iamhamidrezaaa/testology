'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface SurveyResultsModalProps {
  isOpen: boolean
  onClose: () => void
  surveyId: string
  surveyTitle: string
}

export default function SurveyResultsModal({
  isOpen,
  onClose,
  surveyId,
  surveyTitle
}: SurveyResultsModalProps) {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/surveys/${surveyId}/results`)
      if (!response.ok) throw new Error('خطا در دریافت نتایج')
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError('خطا در بارگذاری نتایج')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              نتایج نظرسنجی: {surveyTitle}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">
                {error}
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-2">
                      تاریخ: {new Date(result.createdAt).toLocaleDateString('fa-IR')}
                    </div>
                    {result.answers.map((answer: any, answerIndex: number) => (
                      <div key={answerIndex} className="mb-2">
                        <div className="font-medium text-gray-700">
                          {answer.question.text}
                        </div>
                        <div className="text-gray-600">
                          {answer.option ? answer.option.text : answer.value}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 