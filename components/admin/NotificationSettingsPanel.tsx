'use client'

import { useState } from 'react'
import { TriggerEvent } from '@/lib/types/notification'
import NotificationSettingsForm from './NotificationSettingsForm'

interface NotificationSettingsPanelProps {
  initialSettings: Record<TriggerEvent, {
    email: boolean
    sms: boolean
    push: boolean
  }>
  onSave: (event: TriggerEvent, settings: {
    email: boolean
    sms: boolean
    push: boolean
  }) => Promise<void>
}

const TRIGGER_EVENT_LABELS: Record<TriggerEvent, string> = {
  [TriggerEvent.NEW_USER]: 'کاربر جدید',
  [TriggerEvent.NEW_TEST_RESULT]: 'نتیجه تست جدید',
  [TriggerEvent.NEW_CONTACT_MESSAGE]: 'پیام تماس جدید',
  [TriggerEvent.SYSTEM_ERROR]: 'خطای سیستم',
  [TriggerEvent.NEW_SUPPORT_TICKET]: 'تیکت پشتیبانی جدید',
  [TriggerEvent.NEW_COMMENT]: 'نظر جدید',
  [TriggerEvent.NEW_BLOG_POST]: 'مقاله جدید',
  [TriggerEvent.USER_LEVEL_UP]: 'ارتقای سطح کاربر',
  [TriggerEvent.REFERRAL_COMPLETED]: 'تکمیل ارجاع'
}

export default function NotificationSettingsPanel({
  initialSettings,
  onSave
}: NotificationSettingsPanelProps) {
  const [selectedEvent, setSelectedEvent] = useState<TriggerEvent>(TriggerEvent.NEW_USER)
  const [loading, setLoading] = useState(false)

  const handleSave = async (event: TriggerEvent, settings: {
    email: boolean
    sms: boolean
    push: boolean
  }) => {
    setLoading(true)
    try {
      await onSave(event, settings)
    } catch (error) {
      console.error('خطا در ذخیره تنظیمات:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          انتخاب رویداد
        </label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value as TriggerEvent)}
          className="w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {Object.entries(TRIGGER_EVENT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <NotificationSettingsForm
        event={selectedEvent}
        initialSettings={initialSettings[selectedEvent]}
        onSave={(settings) => handleSave(selectedEvent, settings)}
      />
    </div>
  )
} 