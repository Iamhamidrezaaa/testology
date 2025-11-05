'use client'

import { motion } from 'framer-motion'
import { Brain, Heart, Users, Lightbulb } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: 'علمی و معتبر',
      description: 'تست‌های استاندارد و تحلیل‌های مبتنی بر پژوهش‌های علمی'
    },
    {
      icon: <Heart className="w-8 h-8 text-mint" />,
      title: 'شخصی‌سازی شده',
      description: 'تحلیل‌های هوشمند و پیشنهادهای متناسب با شخصیت شما'
    },
    {
      icon: <Users className="w-8 h-8 text-violet" />,
      title: 'جامعه محور',
      description: 'ارتباط با افراد هم‌فکر و به اشتراک‌گذاری تجربیات'
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-primary/80" />,
      title: 'رشد مستمر',
      description: 'راهنمایی‌های عملی برای توسعه فردی و حرفه‌ای'
    }
  ]

  return (
    <main className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-vazir">
            درباره تستولوژی
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-vazir">
            تستولوژی، پلتفرمی برای خودشناسی عمیق و علمی است که مجموعه‌ای از معتبرترین تست‌های روان‌شناسی دنیا را در اختیار شما قرار می‌دهد.
            هدف ما، کمک به شما در کشف شخصیت، توانمندی‌ها، چالش‌ها و مسیر رشدتان با بهره‌گیری از تحلیل‌های هوشمند و پیشنهادهای شخصی‌سازی‌شده است.
          </p>
        </motion.div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-vazir">
                {value.title}
              </h3>
              <p className="text-gray-600 font-vazir">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 sm:p-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center font-vazir">
            ماموریت ما
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center leading-relaxed font-vazir">
            ما در تستولوژی معتقدیم که خودشناسی، اولین قدم برای رشد و توسعه فردی است. 
            با ترکیب علم روان‌شناسی و تکنولوژی، تلاش می‌کنیم تا مسیر خودشناسی را برای همه افراد، 
            ساده‌تر، جذاب‌تر و کاربردی‌تر کنیم.
          </p>
        </motion.div>
      </div>
    </main>
  )
} 