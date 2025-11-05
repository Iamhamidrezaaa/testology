"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CallToActionSection() {
  return (
    <section className="w-full bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 py-20 px-4 text-center relative overflow-hidden">
      {/* المان‌های تزئینی */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 5,
        }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-white/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto relative z-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-relaxed font-vazir">
          آماده‌ای یک قدم به شناخت بهتر خودت نزدیک‌تر بشی؟
        </h2>
        <p className="mt-4 text-lg text-gray-600 font-vazir">
          فقط چند دقیقه وقت بذار و تست غربالگری روانی ما رو انجام بده. نتیجه‌اش می‌تونه شروع یه مسیر مهم باشه.
        </p>
        <motion.div 
          className="mt-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/screening">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 rounded-2xl shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white font-vazir group"
            >
              شروع تست غربالگری
              <ArrowLeft className="mr-2 w-5 h-5 inline-block transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
} 