'use client'

import { motion } from 'framer-motion'
import { Brain, LineChart, Compass, TrendingUp } from 'lucide-react'

const steps = [
  {
    title: 'شروع تست غربالگری',
    desc: 'با چند سوال ساده، تصویری کلی از وضعیت روانی‌ات بگیر.',
    icon: Brain,
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    title: 'تحلیل هوشمند',
    desc: 'نتایج با کمک هوش مصنوعی تفسیر می‌شن. دقیق و قابل اتکا.',
    icon: LineChart,
    color: 'bg-mint/10 text-mint'
  },
  {
    title: 'دریافت مسیر فردی',
    desc: 'تست‌ها و پیشنهادها مخصوص خودت رو بگیر.',
    icon: Compass,
    color: 'bg-violet-100 text-violet-600'
  },
  {
    title: 'پیشرفت و پیگیری',
    desc: 'در داشبوردت وضعیت روانی‌تو ببین و مسیر رو دنبال کن.',
    icon: TrendingUp,
    color: 'bg-amber-100 text-amber-600'
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

export default function HowItWorks() {
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
            چطور کار می‌کنه؟
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-vazir">
            مسیر ساده و هوشمند تستولوژی برای شناخت بهتر خودت و رشد شخصی
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-4`}>
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-vazir">
                {step.title}
              </h3>
              <p className="text-gray-600 font-vazir">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 