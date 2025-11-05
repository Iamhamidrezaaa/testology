'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { faIR } from 'date-fns/locale'
import Link from 'next/link'

type SuggestedAction = {
  type: "exercise" | "test" | "article";
  title: string;
  description: string;
};

type GrowthPathStep = {
  title: string;
  description: string;
  goal: string;
  suggestedActions: SuggestedAction[];
  estimatedDuration: string;
};

type GrowthPath = {
  id: string;
  summary: string;
  path: GrowthPathStep[];
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  createdAt: string;
};

type TestResult = {
  id: string
  testName: string
  category: string
  score: number
  createdAt: string
}

export default function GrowthPathWidget() {
  const [growthPath, setGrowthPath] = useState<GrowthPath | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [growthRes, testsRes] = await Promise.all([
        axios.get<{ data: GrowthPath }>('/api/user/growth-path'),
        axios.get<{ data: TestResult[] }>('/api/user/test-results'),
      ])

      setGrowthPath(growthRes.data.data)
      setTestResults(testsRes.data.data)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('خطا در دریافت اطلاعات')
    } finally {
      setLoading(false)
    }
  }

  const generateNewPath = async () => {
    try {
      setGenerating(true)
      setError(null)

      const res = await axios.post<{ data: { growthPath: GrowthPath } }>(
        '/api/user/analyze-growth'
      )

      setGrowthPath(res.data.data.growthPath)
    } catch (err: any) {
      console.error('Error generating growth path:', err)
      setError(
        err.response?.data?.message ||
          'خطا در تولید مسیر رشد. لطفاً دوباره تلاش کنید.'
      )
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (testResults.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">مسیر رشد شخصی</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            برای دریافت مسیر رشد شخصی، ابتدا باید تست‌های روان‌شناختی را انجام دهید.
          </p>
          <Link
            href="/tests"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            شروع تست‌ها
          </Link>
        </div>
      </div>
    )
  }

  if (!growthPath) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">مسیر رشد شخصی</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            بر اساس نتایج تست‌های شما، می‌توانیم یک مسیر رشد شخصی‌سازی شده تولید کنیم.
          </p>
          <button
            onClick={generateNewPath}
            disabled={generating}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {generating ? "در حال تولید..." : "تولید مسیر رشد هوشمند"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">مسیر رشد شخصی</h2>
        <button
          onClick={generateNewPath}
          disabled={generating}
          className="text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
        >
          {generating ? "در حال تولید..." : "تولید مسیر جدید"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">تحلیل کلی</h3>
        <p className="text-gray-600">{growthPath.summary}</p>
      </div>

      <div className="space-y-6">
        {growthPath.path.map((step, index) => (
          <div key={index} className="border-r-4 border-indigo-500 pr-4">
            <h3 className="font-semibold text-indigo-700 mb-2">
              مرحله {index + 1}: {step.title}
            </h3>
            <p className="text-gray-600 mb-2">{step.description}</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">هدف:</h4>
              <p className="text-gray-600">{step.goal}</p>
            </div>
            {step.suggestedActions && step.suggestedActions.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium text-gray-700 mb-2">فعالیت‌های پیشنهادی:</h4>
                <ul className="list-disc list-inside space-y-2">
                  {step.suggestedActions.map((action: SuggestedAction, actionIndex: number) => (
                    <li key={actionIndex} className="text-gray-600">
                      <span className="font-medium">{action.title}</span>
                      <p className="text-sm text-gray-500 mr-6">
                        {action.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-2">
              مدت زمان تخمینی: {step.estimatedDuration}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-3">توصیه‌ها</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">فوری</h4>
            <ul className="list-disc list-inside space-y-1">
              {growthPath.recommendations.immediate.map((rec, index) => (
                <li key={index} className="text-yellow-700 text-sm">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">کوتاه‌مدت</h4>
            <ul className="list-disc list-inside space-y-1">
              {growthPath.recommendations.shortTerm.map((rec, index) => (
                <li key={index} className="text-blue-700 text-sm">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">بلندمدت</h4>
            <ul className="list-disc list-inside space-y-1">
              {growthPath.recommendations.longTerm.map((rec, index) => (
                <li key={index} className="text-green-700 text-sm">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        آخرین به‌روزرسانی:{" "}
        {format(new Date(growthPath.createdAt), "PPP", { locale: faIR })}
      </div>
    </div>
  )
} 