'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const feedback = [
  {
    name: 'زهرا',
    type: 'INTJ',
    text: 'واقعا شگفت‌زده شدم. تحلیل دقیق بود و حس کردم یکی منو واقعاً می‌فهمه.',
    avatar: '🧕',
    color: 'bg-violet-100 text-violet-700'
  },
  {
    name: 'سینا',
    type: 'INFP',
    text: 'تست‌ها خیلی حرفه‌ای طراحی شده بودن. داشبورد شخصی هم عالی بود.',
    avatar: '👨‍💻',
    color: 'bg-mint/10 text-mint'
  },
  {
    name: 'مریم',
    type: 'ISFJ',
    text: 'این اولین باره که یک تحلیل آنلاین، این‌قدر با احساسات من هم‌راستا بود.',
    avatar: '👩‍🎓',
    color: 'bg-pink-100 text-pink-600'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function Testimonials() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-softGray">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-vazir">
            نظرات کاربران
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-vazir">
            تجربه‌های واقعی کاربران تستولوژی از مسیر خودشناسی
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {feedback.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{item.avatar}</div>
                <div className="flex-1">
                  <Quote className="w-6 h-6 text-gray-300 mb-2" />
                  <p className="text-gray-600 leading-relaxed mb-4 font-vazir">
                    {item.text}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 font-vazir">
                        {item.name}
                      </div>
                      <div className={`text-sm ${item.color} font-vazir`}>
                        تیپ {item.type}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${item.color} font-vazir`}>
                      {item.type}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 