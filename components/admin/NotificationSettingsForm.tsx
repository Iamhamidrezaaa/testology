'use client'

import { useState } from 'react'
import { TriggerEvent } from '@/lib/types/notification'

interface NotificationSettingsFormProps {
  event: TriggerEvent
  initialSettings: {
    email: boolean
    sms: boolean
    push: boolean
  }
  onSave: (settings: {
    email: boolean
    sms: boolean
    push: boolean
  }) => Promise<void>
}

export default function NotificationSettingsForm({
  event,
  initialSettings,
  onSave
}: NotificationSettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(settings)
    } catch (error) {
      console.error('خطا در ذخیره تنظیمات:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.email}
            onChange={e => setSettings({ ...settings, email: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="mr-2">ایمیل</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.sms}
            onChange={e => setSettings({ ...settings, sms: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="mr-2">پیامک</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.push}
            onChange={e => setSettings({ ...settings, push: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="mr-2">اعلان مرورگر</span>
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
      </button>
    </form>
  )
} 