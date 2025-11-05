'use client'

import { useSiteSettings } from '@/lib/contexts/SiteSettingsContext'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function Header() {
  const { settings, isLoading } = useSiteSettings()
  const { data: session } = useSession()

  if (isLoading) {
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            {settings?.logoUrl && (
              <Link href="/">
                <img
                  src={settings.logoUrl}
                  alt={settings.siteTitle}
                  className="h-8 w-auto"
                />
              </Link>
            )}
            <Link href="/" className="text-xl font-bold text-gray-900">
              {settings?.siteTitle}
            </Link>
          </div>

          <nav className="flex items-center gap-4">
            <Link href="/tests" className="text-gray-600 hover:text-gray-900">
              تست‌ها
            </Link>
            <Link href="/exercises" className="text-gray-600 hover:text-gray-900">
              تمرین‌ها
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900">
              وبلاگ
            </Link>
            {session ? (
              <Link href="/dashboard">
                <Button variant="ghost">داشبورد</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button>ورود</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
} 