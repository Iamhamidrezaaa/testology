import React from 'react'
import { CheckCircle, Users, PlayCircle } from 'lucide-react'

export const HomeSteps: React.FC = () => {
  const steps = [
    {
      title: 'ورود یا عضویت سریع',
      desc: 'با شماره موبایل وارد شوید یا ثبت‌نام کنید.',
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
    },
    {
      title: 'تکمیل تست غربالگری',
      desc: 'تستی ساده و سریع برای شناسایی وضعیت اولیه شما.',
      icon: <PlayCircle className="w-6 h-6 text-blue-500" />,
    },
    {
      title: 'تحلیل شخصی‌سازی‌شده',
      desc: 'تحلیل هوشمند و پیشنهاد تست و تمرین‌های بعدی.',
      icon: <Users className="w-6 h-6 text-purple-500" />,
    },
  ]

  return (
    <section className="py-12 bg-[#f7f7f9]">
      <div className="container max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">مراحل استفاده از تستولوژی</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all">
              <div className="flex justify-center mb-4">{s.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export const TrustSection: React.FC = () => {
  return (
    <section className="py-16 bg-white border-t border-b">
      <div className="container max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">اعتماد کاربران واقعی</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          هزاران کاربر از تستولوژی برای شناخت بهتر خود، کاهش اضطراب، افزایش تمرکز و رشد روانی استفاده کرده‌اند.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-700">"با تحلیل تست غربالگری فهمیدم چقدر فشار پنهان رومه... فوق‌العاده بود!"</p>
            <p className="mt-2 text-xs text-gray-500">— نسترن، ۲۹ ساله</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-700">"راستش انتظار نداشتم انقدر دقیق باشه... الان مسیرم روشن‌تره."</p>
            <p className="mt-2 text-xs text-gray-500">— مهدی، ۳۵ ساله</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-700">"ترکیب تست با گفت‌وگو با هوش مصنوعی خیلی کمکم کرد."</p>
            <p className="mt-2 text-xs text-gray-500">— لیلا، ۲۴ ساله</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export const CtaStart: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">آماده‌ای برای شروع سفر خودشناسی؟</h2>
        <p className="text-lg mb-6">با تست غربالگری شروع کن، تحلیل هوشمند بگیر و مسیرت رو بهتر بشناس</p>
        <a href="/tests/screening" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-100">
          شروع تست غربالگری
        </a>
      </div>
    </section>
  )
} 