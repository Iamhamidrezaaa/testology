'use client'

import { useState } from 'react'
import { sendSystemSMS } from '@/lib/services/sms'
import { TriggerEvent, NotificationData } from '@/lib/types/notification'

interface NotificationStatusProps {
  event: TriggerEvent
  data: NotificationData[TriggerEvent]
}

export default function NotificationStatus({ event, data }: NotificationStatusProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSendNotification = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      // در اینجا می‌توانید بر اساس نوع رویداد، پیام مناسب را ارسال کنید
      let message = ''
      switch (event) {
        case TriggerEvent.NEW_USER:
          message = `سلام ${(data as NotificationData[typeof TriggerEvent.NEW_USER]).name} عزیز، به تستولوژی خوش آمدید!`
          break
        case TriggerEvent.NEW_TEST_RESULT:
          message = `نتیجه تست شما آماده است. امتیاز شما: ${(data as NotificationData[typeof TriggerEvent.NEW_TEST_RESULT]).score}`
          break
        case TriggerEvent.USER_LEVEL_UP:
          message = `تبریک! شما به سطح ${(data as NotificationData[typeof TriggerEvent.USER_LEVEL_UP]).newLevel} ارتقا یافتید.`
          break
        default:
          message = 'این یک پیام تست است.'
      }

      // در اینجا باید شماره موبایل کاربر را از داده‌ها استخراج کنید
      // این یک مثال است و باید بر اساس ساختار داده‌های واقعی شما تغییر کند
      const phoneNumber = 'phoneNumber' in data ? data.phoneNumber : ''

      if (phoneNumber) {
        await sendSystemSMS({
          to: phoneNumber,
          message
        })
        setSuccess(true)
      } else {
        throw new Error('شماره موبایل یافت نشد')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ارسال پیامک')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">وضعیت اعلان‌ها</h3>
          <p className="text-sm text-gray-500">رویداد: {event}</p>
        </div>
        <button
          onClick={handleSendNotification}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'در حال ارسال...' : 'ارسال پیامک تست'}
        </button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 text-sm text-green-700 bg-green-100 rounded-md">
          پیامک با موفقیت ارسال شد
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium mb-2">داده‌های رویداد:</h4>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  )
} 