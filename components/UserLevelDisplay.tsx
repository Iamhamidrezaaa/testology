import { useEffect, useState } from 'react'
import Image from 'next/image'
import { UserLevel } from '@/types/user'

interface UserLevelDisplayProps {
  userId: string
  points: number
  currentLevel?: UserLevel
}

export default function UserLevelDisplay({ userId, points, currentLevel }: UserLevelDisplayProps) {
  const [level, setLevel] = useState<UserLevel | null>(currentLevel || null)
  const [loading, setLoading] = useState(false)

  const updateLevel = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/level/update', {
        method: 'POST'
      })
      const data = await response.json()
      if (data.success && data.level) {
        setLevel(data.level)
      }
    } catch (error) {
      console.error('خطا در به‌روزرسانی سطح:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!currentLevel) {
      updateLevel()
    }
  }, [currentLevel])

  if (!level) {
    return <div>در حال بارگذاری...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        {level.badgeUrl && (
          <div className="relative w-16 h-16">
            <Image
              src={level.badgeUrl}
              alt={level.title}
              fill
              className="object-contain"
            />
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold text-gray-900">{level.title}</h3>
          <p className="text-gray-600">سطح {level.level}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>امتیاز فعلی: {points}</span>
          <span>امتیاز مورد نیاز برای سطح بعدی: {level.minPoints}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{
              width: `${Math.min((points / level.minPoints) * 100, 100)}%`
            }}
          />
        </div>
      </div>

      {level.benefits && level.benefits.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-900 mb-2">مزایای این سطح:</h4>
          <ul className="list-disc list-inside text-gray-600">
            {(level.benefits as any)?.map((benefit: string, index: number) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={updateLevel}
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی سطح'}
      </button>
    </div>
  )
} 