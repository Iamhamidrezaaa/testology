'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TestBundleForm from '@/components/admin/modules/TestBundleForm'
import { toast } from 'react-hot-toast'

interface Test {
  id: string
  title: string
  description: string
}

interface TestBundleTest {
  id: string
  testId: string
  order: number
  test: Test
}

interface TestBundle {
  id: string
  name: string
  description: string
  tests: TestBundleTest[]
}

export default function EditTestBundlePage({ params }: { params: { id: string } }) {
  const [bundle, setBundle] = useState<TestBundle | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchBundle()
  }, [params.id])

  const fetchBundle = async () => {
    try {
      const response = await fetch(`/api/admin/test-bundles/${params.id}`)
      if (!response.ok) throw new Error('خطا در دریافت باندل')
      const data = await response.json()
      setBundle(data)
    } catch (error) {
      console.error('Error fetching bundle:', error)
      toast.error('خطا در دریافت باندل')
      router.push('/admin-panel/test-bundles')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>در حال بارگذاری...</div>
  }

  if (!bundle) {
    return null
  }

  return (
    <div className="container mx-auto py-6">
      <TestBundleForm bundle={bundle} mode="edit" />
    </div>
  )
} 