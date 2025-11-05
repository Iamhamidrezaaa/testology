"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function MinimalCTA() {
  return (
    <section className="bg-gradient-to-b from-sky-50 to-white py-20 text-center relative overflow-hidden">
      {/* المان‌های تزئینی ظریف */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-indigo-200 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto px-4 relative z-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight font-vazir">
          سفر خودشناسی‌ات رو همین حالا شروع کن
        </h2>
        <p className="mt-4 text-lg text-gray-600 font-vazir">
          تست روان‌شناسی غربالگری رو انجام بده تا ببینی کدوم مسیر مناسب توئه
        </p>
        <motion.div 
          className="mt-8"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link href="/tests/screening">
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-vazir group"
            >
              شروع تست رایگان
              <ArrowLeft className="mr-2 w-5 h-5 inline-block transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
} 