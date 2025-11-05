'use client'

import { useState } from 'react'

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email')

  return (
    <div className="font-vazir">
      {/* تب‌ها */}
      <div className="flex mb-4">
        <button
          className={`w-1/2 py-2 text-sm font-semibold rounded-t-md ${
            activeTab === 'email' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'
          }`}
          onClick={() => setActiveTab('email')}
        >
          ورود با ایمیل
        </button>
        <button
          className={`w-1/2 py-2 text-sm font-semibold rounded-t-md ${
            activeTab === 'phone' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'
          }`}
          onClick={() => setActiveTab('phone')}
        >
          ورود با شماره موبایل
        </button>
      </div>

      {/* فرم‌ها */}
      <div className="bg-white border rounded-b-md p-4 shadow-sm">
        {activeTab === 'email' ? (
          <form className="space-y-4">
            <div>
              <label className="block text-sm mb-1">ایمیل</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="example@mail.com"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              دریافت کد ورود
            </button>
          </form>
        ) : (
          <form className="space-y-4">
            <div>
              <label className="block text-sm mb-1">شماره موبایل</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="09xxxxxxxxx"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              دریافت کد ورود
            </button>
          </form>
        )}
      </div>
    </div>
  )
} 