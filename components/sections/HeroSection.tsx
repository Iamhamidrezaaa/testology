"use client"

import { motion } from "framer-motion"
import SmartStartButton from "@/components/ui/SmartStartButton"

export default function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-white to-[#f3f4f6] py-20 px-4 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6 font-vazir">
          شناخت خود را از همین‌جا شروع کنید
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 font-vazir">
          تست‌های روان‌شناسی معتبر، تحلیل‌های شخصی‌سازی‌شده و مسیر رشد ذهنی متناسب با شما
        </p>
        <SmartStartButton className="text-lg px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all font-vazir">
          شروع تست غربالگری
        </SmartStartButton>
      </motion.div>

      {/* تصویر یا المان بصری */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-16 max-w-xl mx-auto"
      >
        <img
          src="/images/hero-illustration.svg"
          alt="Testology Illustration"
          className="w-full h-auto"
        />
      </motion.div>

      {/* المان‌های تزئینی متحرک */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-20 left-10 w-20 h-20 bg-indigo-200 rounded-full opacity-20"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.5,
        }}
        className="absolute bottom-20 right-10 w-16 h-16 bg-mint rounded-full opacity-20"
      />
    </section>
  )
} 