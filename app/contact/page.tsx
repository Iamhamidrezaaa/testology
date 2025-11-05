'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    // اینجا می‌تونی به یک API وصل کنی یا فقط ذخیره‌سازی انجام بدی
  }

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      title: 'ایمیل',
      content: 'info@testology.ir',
      link: 'mailto:info@testology.ir'
    },
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      title: 'تلفن',
      content: '۰۲۱-۱۲۳۴۵۶۷۸',
      link: 'tel:+982112345678'
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      title: 'آدرس',
      content: 'تهران، خیابان ولیعصر',
      link: 'https://maps.google.com'
    }
  ]

  return (
    <main className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-vazir">
            تماس با ما
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-vazir">
            اگر سوال، پیشنهاد یا همکاری دارید، خوشحال می‌شویم از شما بشنویم.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-soft hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-3 bg-blue-50 rounded-xl">
                  {info.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 font-vazir">
                    {info.title}
                  </h3>
                  <p className="text-gray-600 font-vazir">
                    {info.content}
                  </p>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-soft"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="نام شما"
                    required
                    onChange={handleChange}
                    className="font-vazir"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="ایمیل شما"
                    required
                    onChange={handleChange}
                    className="font-vazir"
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder="پیام شما"
                    rows={5}
                    required
                    onChange={handleChange}
                    className="font-vazir"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark font-vazir"
                >
                  <Send className="w-4 h-4 ml-2" />
                  ارسال پیام
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-vazir">
                  پیام شما با موفقیت ارسال شد
                </h3>
                <p className="text-gray-600 font-vazir">
                  در اسرع وقت به پیام شما پاسخ خواهیم داد.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  )
} 