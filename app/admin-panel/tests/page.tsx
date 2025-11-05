'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TestsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [tests, setTests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user && !(session.user as any).isAdmin) {
      router.push('/')
      return
    }

    fetchTests()
  }, [session])

  const fetchTests = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/tests')
      if (!response.ok) throw new Error('خطا در دریافت تست‌ها')
      
      const data = await response.json()
      setTests(data.tests || [])
    } catch (error) {
      console.error('Error fetching tests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="p-6">در حال بارگذاری...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">تست‌ها</h1>
        <Link href="/admin-panel/tests/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          تست جدید
        </Link>
      </div>
      
      {tests.length === 0 ? (
        <p>هیچ تستی یافت نشد</p>
      ) : (
        <div className="grid gap-4">
          {tests.map((test: any) => (
            <div key={test.id} className="border p-4 rounded">
              <h2 className="font-bold">{test.title}</h2>
              <Link href={`/admin-panel/tests/${test.id}/questions`} className="text-blue-600">
                مشاهده سوالات
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}