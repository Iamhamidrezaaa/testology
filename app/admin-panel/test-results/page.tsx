'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function TestResultsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user && !(session.user as any).isAdmin) {
      router.push('/')
      return
    }

    fetchResults()
  }, [session])

  const fetchResults = async () => {
    try {
      setIsLoading(true)
      // TODO: Implement API endpoint for test results
      setResults([])
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="p-6">در حال بارگذاری...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">نتایج تست‌ها</h1>
      {results.length === 0 ? (
        <p>هیچ نتیجه‌ای یافت نشد</p>
      ) : (
        <div>
          {/* TODO: Display results */}
        </div>
      )}
    </div>
  )
}