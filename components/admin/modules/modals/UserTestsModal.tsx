'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Filter } from 'lucide-react'
import { formatDate } from '@/lib/utils'

type TestResult = {
  id: string
  testTitle: string
  createdAt: string
  analyzed: boolean
  score: number | null
  totalScore: number | null
  correctAnswers: number
  totalQuestions: number
}

type UserTestsModalProps = {
  userId: string
  fullName: string
  onClose: () => void
}

export default function UserTestsModal({ userId, fullName, onClose }: UserTestsModalProps) {
  const [tests, setTests] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [analysisFilter, setAnalysisFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/admin/users/${userId}/tests`)
        if (!res.ok) throw new Error('خطا در دریافت تست‌ها')
        const data = await res.json()
        setTests(data)
      } catch (err) {
        console.error('Error fetching tests:', err)
        setError('خطا در دریافت تست‌ها')
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [userId])

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.testTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDate = dateFilter === 'all' || (
      dateFilter === 'today' && new Date(test.createdAt).toDateString() === new Date().toDateString()
    ) || (
      dateFilter === 'week' && new Date(test.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ) || (
      dateFilter === 'month' && new Date(test.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    )
    const matchesAnalysis = analysisFilter === 'all' || (
      analysisFilter === 'analyzed' && test.analyzed
    ) || (
      analysisFilter === 'pending' && !test.analyzed
    )
    return matchesSearch && matchesDate && matchesAnalysis
  })

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/tests/export?format=${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tests: filteredTests })
      })
      
      if (!res.ok) throw new Error('خطا در دانلود فایل')
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `test-results-${fullName}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error exporting tests:', err)
      setError('خطا در دانلود فایل')
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <p>در حال بارگذاری...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <Dialog open={!!userId} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>تست‌های انجام‌شده توسط {fullName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="جستجو در عنوان تست..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="فیلتر تاریخ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه تاریخ‌ها</SelectItem>
                <SelectItem value="today">امروز</SelectItem>
                <SelectItem value="week">هفته گذشته</SelectItem>
                <SelectItem value="month">ماه گذشته</SelectItem>
              </SelectContent>
            </Select>
            <Select value={analysisFilter} onValueChange={setAnalysisFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="وضعیت تحلیل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="analyzed">تحلیل‌شده</SelectItem>
                <SelectItem value="pending">در انتظار تحلیل</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 ml-2" />
                PDF
              </Button>
              <Button variant="outline" onClick={() => handleExport('excel')}>
                <Download className="h-4 w-4 ml-2" />
                Excel
              </Button>
            </div>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredTests.length === 0 ? (
              <p className="text-muted-foreground text-sm">هیچ تستی یافت نشد.</p>
            ) : (
              filteredTests.map((test, i) => (
                <div key={test.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{i + 1}. {test.testTitle}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        تاریخ: {formatDate(test.createdAt)}
                      </div>
                    </div>
                    <Badge variant={test.analyzed ? "default" : "secondary"}>
                      {test.analyzed ? 'تحلیل‌شده' : 'در انتظار تحلیل'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div className="bg-muted p-2 rounded">
                      <div className="text-muted-foreground">نمره</div>
                      <div className="font-medium">
                        {test.score !== null ? `${test.score}/${test.totalScore}` : '-'}
                      </div>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <div className="text-muted-foreground">پاسخ‌های صحیح</div>
                      <div className="font-medium">
                        {test.correctAnswers}/{test.totalQuestions}
                      </div>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <div className="text-muted-foreground">درصد موفقیت</div>
                      <div className="font-medium">
                        {test.totalQuestions > 0
                          ? `${Math.round((test.correctAnswers / test.totalQuestions) * 100)}%`
                          : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 