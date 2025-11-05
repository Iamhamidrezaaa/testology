"use client"

import Link from "next/link"
import { useUISettings } from "@/lib/hooks/useUISettings"
import NewsletterSignup from "@/components/NewsletterSignup"

export function SiteFooter() {
  const { settings } = useUISettings()

  return (
    <footer className="bg-white border-t text-sm text-gray-600 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-gray-900 mb-2">تستولوژی</h4>
          <p>پلتفرم تست‌های روان‌شناسی دقیق و تحلیل‌شده با هوش مصنوعی.</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-2">دسترسی سریع</h4>
          <ul className="space-y-1">
            <li><Link href="/tests" className="hover:text-indigo-600">تست‌ها</Link></li>
            <li><Link href="/blog" className="hover:text-indigo-600">مقالات</Link></li>
            <li><Link href="/demo" className="hover:text-indigo-600">مغز جمعی</Link></li>
            <li><Link href="/about-us" className="hover:text-indigo-600">درباره ما</Link></li>
            <li><Link href="/contact-us" className="hover:text-indigo-600">تماس با ما</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-2">قوانین</h4>
          <ul className="space-y-1">
            <li><Link href="/privacy" className="hover:text-indigo-600">حریم خصوصی</Link></li>
            <li><Link href="/terms" className="hover:text-indigo-600">قوانین و مقررات</Link></li>
          </ul>
        </div>
        <div>
          <NewsletterSignup />
        </div>
      </div>
      <div className="text-center mt-8 text-xs text-gray-500">
        © {new Date().getFullYear()} Testology. تمامی حقوق محفوظ است.
      </div>
    </footer>
  )
} 