"use client"

import { motion } from 'framer-motion'
import { CheckCircle, BarChart, Brain, Rocket } from 'lucide-react'

const steps = [
  {
    icon: <Brain className="w-8 h-8 text-indigo-500" />,
    title: 'شروع تست غربالگری',
    desc: 'با چند سؤال ساده، تصویری کلی از وضعیت روانی‌ات بگیر.'
  },
  {
    icon: <BarChart className="w-8 h-8 text-blue-500" />,
    title: 'تحلیل هوشمند',
    desc: 'نتایجت با کمک هوش مصنوعی تفسیر می‌شه، بدون قضاوت.'
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
    title: 'دریافت مسیر فردی',
    desc: 'تمرین‌ها، تست‌ها و پیشنهادات مخصوص خودت رو ببین.'
  },
  {
    icon: <Rocket className="w-8 h-8 text-purple-500" />,
    title: 'پیشرفت و پیگیری',
    desc: 'در داشبوردت وضعیت روانی‌تو ببین و مسیر رشدتو دنبال کن.'
  }
]

// انیمیشن برای خط اتصال بین کارت‌ها
const ConnectingLine = () => (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="hidden md:block absolute left-1/2 top-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-200 to-emerald-200 -z-10 transform -translate-x-1/2 -translate-y-1/2"
  />
)

export default function TestStepsSection() {
  return (
    <section className="py-16 px-4 md:px-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 font-vazir">چطور کار می‌کنه؟</h2>
          <p className="text-lg text-gray-600 mb-12 font-vazir">فقط در چند قدم ساده، مسیر رشد روانی‌تو پیدا کن</p>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <ConnectingLine />
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative z-10"
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gray-50 p-3 rounded-full"
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-xl font-semibold font-vazir">{step.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed font-vazir">{step.desc}</p>
              
              {/* شماره مرحله */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 