'use client'

import { useState } from 'react'
import NotificationStatus from '@/components/admin/NotificationStatus'
import { TriggerEvent, NotificationData } from '@/lib/types/notification'

const TEST_DATA: Record<TriggerEvent, NotificationData[TriggerEvent]> = {
  [TriggerEvent.NEW_USER]: {
    id: 'test-user-id',
    name: 'کاربر تست',
    email: 'test@example.com',
    createdAt: new Date().toISOString()
  },
  [TriggerEvent.NEW_TEST_RESULT]: {
    id: 'test-result-id',
    userId: 'test-user-id',
    testId: 'test-test-id',
    score: 85,
    completedAt: new Date().toISOString()
  },
  [TriggerEvent.NEW_CONTACT_MESSAGE]: {
    id: 'test-message-id',
    name: 'فرستنده تست',
    email: 'sender@example.com',
    message: 'این یک پیام تست است',
    createdAt: new Date().toISOString()
  },
  [TriggerEvent.SYSTEM_ERROR]: {
    id: 'test-error-id',
    message: 'این یک خطای تست است',
    stack: 'خطای تست\nخطای تست\nخطای تست',
    timestamp: new Date().toISOString()
  },
  [TriggerEvent.NEW_SUPPORT_TICKET]: {
    id: 'test-ticket-id',
    userId: 'test-user-id',
    subject: 'موضوع تست',
    message: 'پیام تست',
    createdAt: new Date().toISOString()
  },
  [TriggerEvent.NEW_COMMENT]: {
    id: 'test-comment-id',
    userId: 'test-user-id',
    content: 'نظر تست',
    createdAt: new Date().toISOString()
  },
  [TriggerEvent.NEW_BLOG_POST]: {
    id: 'test-post-id',
    title: 'عنوان تست',
    content: 'محتوا تست',
    createdAt: new Date().toISOString()
  },
  [TriggerEvent.USER_LEVEL_UP]: {
    id: 'test-level-up-id',
    userId: 'test-user-id',
    oldLevel: 1,
    newLevel: 2,
    updatedAt: new Date().toISOString()
  },
  [TriggerEvent.REFERRAL_COMPLETED]: {
    id: 'test-referral-id',
    referrerId: 'test-user-id',
    referredId: 'test-referred-id',
    completedAt: new Date().toISOString()
  }
}

export default function TestNotificationsPage() {
  const [selectedEvent, setSelectedEvent] = useState<TriggerEvent>(TriggerEvent.NEW_USER)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">تست نوتیفیکیشن‌ها</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          انتخاب رویداد
        </label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value as TriggerEvent)}
          className="w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value={TriggerEvent.NEW_USER}>کاربر جدید</option>
          <option value={TriggerEvent.NEW_TEST_RESULT}>نتیجه تست جدید</option>
          <option value={TriggerEvent.NEW_CONTACT_MESSAGE}>پیام تماس جدید</option>
          <option value={TriggerEvent.SYSTEM_ERROR}>خطای سیستم</option>
          <option value={TriggerEvent.NEW_SUPPORT_TICKET}>تیکت پشتیبانی جدید</option>
          <option value={TriggerEvent.NEW_COMMENT}>نظر جدید</option>
          <option value={TriggerEvent.NEW_BLOG_POST}>مقاله جدید</option>
          <option value={TriggerEvent.USER_LEVEL_UP}>ارتقای سطح کاربر</option>
          <option value={TriggerEvent.REFERRAL_COMPLETED}>تکمیل ارجاع</option>
        </select>
      </div>

      <NotificationStatus
        event={selectedEvent}
        data={TEST_DATA[selectedEvent]}
      />
    </div>
  )
} 