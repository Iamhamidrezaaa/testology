"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

const tests = [
  {
    slug: 'mbti',
    title: 'تست شخصیت MBTI',
    description: 'تست معروف ۱۶ تیپ شخصیتی با تحلیل کامل.',
    image: '/images/tests/mbti.svg',
    color: 'from-indigo-500/20 to-transparent'
  },
  {
    slug: 'gad7',
    title: 'تست اضطراب GAD-7',
    description: 'تشخیص سطح اضطراب عمومی در ۷ سؤال.',
    image: '/images/tests/gad7.svg',
    color: 'from-green-500/20 to-transparent'
  },
  {
    slug: 'phq9',
    title: 'تست افسردگی PHQ-9',
    description: 'یکی از دقیق‌ترین تست‌های غربالگری افسردگی.',
    image: '/images/tests/phq9.svg',
    color: 'from-pink-500/20 to-transparent'
  },
  {
    slug: 'rosenberg',
    title: 'تست عزت‌نفس روزنبرگ',
    description: 'تحلیل میزان اعتماد به نفس در روابط و تصمیم‌گیری.',
    image: '/images/tests/rosenberg.svg',
    color: 'from-purple-500/20 to-transparent'
  },
]

export default function FeaturedTestsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800 font-vazir">نمونه تست‌های محبوب</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-vazir">
            تست‌های استاندارد و معتبر روان‌شناسی برای شناخت بهتر خود و مسیر رشد فردی
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tests.map((test, index) => (
            <motion.div
              key={test.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group"
            >
              <div className={`relative h-48 bg-gradient-to-b ${test.color}`}>
                <Image
                  src={test.image}
                  alt={test.title}
                  width={400}
                  height={200}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 font-vazir">{test.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 font-vazir">{test.description}</p>
                </div>
                <Link
                  href={`/tests/${test.slug}`}
                  className="inline-flex items-center justify-center gap-2 mt-auto px-4 py-2 bg-indigo-500 text-white text-sm rounded-xl hover:bg-indigo-600 transition group-hover:shadow-md font-vazir"
                >
                  شروع تست
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 