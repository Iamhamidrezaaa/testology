'use client'

import { useSiteSettings } from '@/lib/contexts/SiteSettingsContext'
import { Loader2 } from 'lucide-react'

export default function Footer() {
  const { settings, isLoading } = useSiteSettings()

  if (isLoading) {
    return (
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">درباره ما</h3>
            <p className="text-sm text-gray-600">
              {settings?.welcomeText}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <a href="/tests" className="text-sm text-gray-600 hover:text-gray-900">
                  تست‌ها
                </a>
              </li>
              <li>
                <a href="/exercises" className="text-sm text-gray-600 hover:text-gray-900">
                  تمرین‌ها
                </a>
              </li>
              <li>
                <a href="/blog" className="text-sm text-gray-600 hover:text-gray-900">
                  وبلاگ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">تماس با ما</h3>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  فرم تماس
                </a>
              </li>
              <li>
                <a href="/support" className="text-sm text-gray-600 hover:text-gray-900">
                  پشتیبانی
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            {settings?.footerText}
          </p>
        </div>
      </div>
    </footer>
  )
} 