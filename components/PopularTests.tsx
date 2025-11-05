'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Brain, Heart, Activity, Star } from 'lucide-react'

const tests = [
  {
    id: 'mbti',
    name: 'MBTI شخصیت',
    desc: 'تست معروف تیپ‌های شخصیتی با تحلیل کامل.',
    color: 'bg-violet-100',
    textColor: 'text-violet-700',
    icon: Brain,
    link: '/tests/mbti'
  },
  {
    id: 'gad7',
    name: 'تست اضطراب GAD-7',
    desc: 'تشخیص سطح اضطراب عمومی در ۷ سوال.',
    color: 'bg-mint/10',
    textColor: 'text-mint',
    icon: Activity,
    link: '/tests/gad7'
  },
  {
    id: 'phq9',
    name: 'PHQ-9 افسردگی',
    desc: 'برای تشخیص شدت افسردگی بالینی',
    color: 'bg-pink-100',
    textColor: 'text-pink-600',
    icon: Heart,
    link: '/tests/phq9'
  },
  {
    id: 'rosenberg',
    name: 'تست عزت‌نفس روزنبرگ',
    desc: 'تحلیل میزان عزت‌نفس و رابطه با خودت.',
    color: 'bg-blue-100',
    textColor: 'text-blue-600',
    icon: Star,
    link: '/tests/rosenberg'
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

export default function PopularTests() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-vazir">
            تست‌های محبوب
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-vazir">
            مجموعه‌ای از معتبرترین تست‌های روانشناسی برای شناخت بهتر خودت
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {tests.map((test) => (
            <motion.div
              key={test.id}
              variants={itemVariants}
              className={`${test.color} rounded-2xl p-6 flex flex-col justify-between h-full transform transition-all duration-300 hover:scale-105`}
            >
              <div>
                <div className={`w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center mb-4`}>
                  <test.icon className={`w-6 h-6 ${test.textColor}`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${test.textColor} font-vazir`}>
                  {test.name}
                </h3>
                <p className="text-gray-700 font-vazir">
                  {test.desc}
                </p>
              </div>
              <Link href={test.link} className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full bg-white hover:bg-white/90 text-gray-900 border-none shadow-sm font-vazir"
                >
                  شروع تست
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 