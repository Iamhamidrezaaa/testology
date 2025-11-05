import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const CTASection: React.FC = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-violet-100 via-white to-purple-50 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">
          آیا آماده‌ای خودت را بهتر بشناسی؟
        </h2>
        <p className="text-gray-600 text-lg md:text-xl mb-8">
          با انجام تست غربالگری رایگان، مسیر خودشناسی را شروع کن و دقیق‌ترین تحلیل روانی را دریافت کن.
        </p>
        <Link href="/tests/screening">
          <Button size="lg" className="text-base md:text-lg px-8 py-5 shadow-xl hover:scale-105 transition-transform">
            شروع تست غربالگری
          </Button>
        </Link>
      </div>
      <div className="absolute top-0 left-0 w-40 h-40 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse -z-10"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-indigo-400 rounded-full opacity-20 blur-3xl animate-ping -z-10"></div>
    </section>
  )
}

export default CTASection 