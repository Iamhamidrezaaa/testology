'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Bell, Search, Settings, User, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const profileTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleNotificationMouseEnter = () => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
      notificationTimeoutRef.current = null
    }
    setShowNotifications(true)
  }

  const handleNotificationMouseLeave = () => {
    notificationTimeoutRef.current = setTimeout(() => {
      setShowNotifications(false)
    }, 1500)
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
      notificationTimeoutRef.current = null
    }
  }

  const handleProfileMouseEnter = () => {
    if (profileTimeoutRef.current) {
      clearTimeout(profileTimeoutRef.current)
      profileTimeoutRef.current = null
    }
    setShowProfile(true)
  }

  const handleProfileMouseLeave = () => {
    profileTimeoutRef.current = setTimeout(() => {
      setShowProfile(false)
    }, 1500)
  }

  const handleProfileClick = () => {
    setShowProfile(!showProfile)
    if (profileTimeoutRef.current) {
      clearTimeout(profileTimeoutRef.current)
      profileTimeoutRef.current = null
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.notification-dropdown') && !target.closest('.profile-dropdown')) {
        setShowNotifications(false)
        setShowProfile(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
      if (profileTimeoutRef.current) {
        clearTimeout(profileTimeoutRef.current)
      }
    }
  }, [])

  return (
    <header className="w-full h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
      {/* سمت راست - عنوان */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">پنل مدیریت Testology</h2>
        <p className="text-sm text-gray-500">مدیریت کامل سیستم روان‌شناسی</p>
      </div>

      {/* وسط - جستجو */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="جستجو در سیستم..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* سمت چپ - دکمه‌ها */}
      <div className="flex items-center space-x-4">
        {/* اعلان‌ها */}
        <div 
          className="relative notification-dropdown"
          onMouseEnter={handleNotificationMouseEnter}
          onMouseLeave={handleNotificationMouseLeave}
        >
          <Button
            variant="ghost"
            size="sm"
            className="relative hover:bg-gray-100"
            onClick={handleNotificationClick}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>

          {showNotifications && (
            <Card className="absolute right-0 top-12 w-80 z-50 bg-white border border-gray-200 shadow-lg">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-800">اعلان‌های اخیر</div>
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-50 rounded text-sm">
                      <div className="font-medium text-gray-800">کاربر جدید</div>
                      <div className="text-gray-600">کاربر جدید ثبت‌نام کرد</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded text-sm">
                      <div className="font-medium text-gray-800">تست جدید</div>
                      <div className="text-gray-600">تست جدید انجام شد</div>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded text-sm">
                      <div className="font-medium text-gray-800">هشدار سیستم</div>
                      <div className="text-gray-600">ظرفیت سرور ۸۰٪</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* تنظیمات */}
        <Link href="/admin/settings">
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>

        {/* پروفایل کاربر */}
        <div 
          className="relative profile-dropdown"
          onMouseEnter={handleProfileMouseEnter}
          onMouseLeave={handleProfileMouseLeave}
        >
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 hover:bg-gray-100"
            onClick={handleProfileClick}
          >
            <User className="h-5 w-5" />
            <span className="hidden md:block">مدیر کل</span>
          </Button>

          {showProfile && (
            <Card className="absolute right-0 top-12 w-48 z-50 bg-white border border-gray-200 shadow-lg">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-800">مدیر کل</div>
                  <div className="text-xs text-gray-500">admin@testology.com</div>
                  <div className="space-y-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      پروفایل
                    </Button>
                    <Link href="/admin/settings">
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        تنظیمات
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:text-red-700">
                      <LogOut className="h-4 w-4 mr-2" />
                      خروج
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </header>
  )
}