'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'
import { faIR } from 'date-fns/locale'
import { TestTube, Calendar, MapPin, Mail, Phone, User } from 'lucide-react'

type TestResult = {
  id: string
  testName: string
  score: number | null
  totalScore: number | null
  createdAt: string
  result: any
}

type User = {
  id: string
  firstName: string | null
  lastName: string | null
  phoneNumber: string
  email: string
  country: string | null
  province: string | null
  city: string | null
  age: number | null
  gender: string | null
  role: string
  testCount: number
  lastTestDate: string | null
  psychologicalScores: {
    stress: number | null
    anxiety: number | null
    depression: number | null
  } | null
  createdAt: string
}

export default function UserDetailsModal({
  user,
  onClose
}: {
  user: User
  onClose: () => void
}) {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTestResults()
  }, [user.id])

  const fetchTestResults = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/admin/users/${user.id}/tests`)
      if (!res.ok) throw new Error('خطا در دریافت تست‌های کاربر')
      const data = await res.json()
      setTestResults(data)
    } catch (err) {
      console.error('Error fetching test results:', err)
      setError('خطا در دریافت تست‌های کاربر')
    } finally {
      setLoading(false)
    }
  }

  const getGenderText = (gender: string | null) => {
    switch (gender) {
      case 'male': return 'مرد'
      case 'female': return 'زن'
      default: return 'نامشخص'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'مدیر'
      case 'therapist': return 'درمانگر'
      default: return 'کاربر'
    }
  }

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>جزئیات کاربر</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList>
            <TabsTrigger value="info">اطلاعات کاربر</TabsTrigger>
            <TabsTrigger value="tests">تست‌های انجام شده</TabsTrigger>
            <TabsTrigger value="scores">نمرات روان‌شناسی</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span className="font-medium">نام:</span>
                  <span>{user.firstName} {user.lastName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">شماره تماس:</span>
                  <span>{user.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">ایمیل:</span>
                  <span>{user.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">موقعیت:</span>
                  <span>
                    {[user.country, user.province, user.city]
                      .filter(Boolean)
                      .join('، ') || '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">تاریخ عضویت:</span>
                  <span>
                    {format(new Date(user.createdAt), 'PPP', { locale: faIR })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TestTube className="h-4 w-4" />
                  <span className="font-medium">تعداد تست‌ها:</span>
                  <span>{user.testCount}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tests">
            {loading ? (
              <p>در حال بارگذاری...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="space-y-4">
                {testResults.map(test => (
                  <div key={test.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{test.testName}</h4>
                        <p className="text-sm text-gray-500">
                          {format(new Date(test.createdAt), 'PPP', { locale: faIR })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          نمره: {test.score || '-'}
                          {test.totalScore && ` از ${test.totalScore}`}
                        </p>
                      </div>
                    </div>
                    {test.result && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium">نتیجه:</p>
                        <pre className="mt-1 p-2 bg-gray-50 rounded">
                          {JSON.stringify(test.result, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="scores">
            {user.psychologicalScores ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <h4 className="font-medium mb-2">استرس</h4>
                  <p className="text-2xl">{user.psychologicalScores.stress || '-'}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <h4 className="font-medium mb-2">اضطراب</h4>
                  <p className="text-2xl">{user.psychologicalScores.anxiety || '-'}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <h4 className="font-medium mb-2">افسردگی</h4>
                  <p className="text-2xl">{user.psychologicalScores.depression || '-'}</p>
                </div>
              </div>
            ) : (
              <p>اطلاعات روان‌شناسی موجود نیست</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 