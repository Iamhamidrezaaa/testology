import React from 'react'
import { CheckCircle } from 'lucide-react'

const features = [
  {
    title: "تحلیل شخصی‌سازی‌شده",
    description: "با استفاده از GPT و داده‌های تست، تحلیل دقیق و متناسب با ویژگی‌های فردی دریافت می‌کنید.",
  },
  {
    title: "پیشنهاد تست هوشمند",
    description: "بر اساس پاسخ‌ها و مکالمات شما، تست‌های بعدی به‌طور خودکار پیشنهاد می‌شود.",
  },
  {
    title: "تمرین و پیگیری مستمر",
    description: "تمرین‌های روان‌شناختی مؤثر همراه با سیستم پیگیری، شما را در مسیر رشد همراهی می‌کنند.",
  },
  {
    title: "مشاوره هوشمند",
    description: "گفت‌وگو با روان‌شناس مجازی برای دریافت راهکار، پیشنهاد تست یا ارجاع به روان‌درمانگر.",
  },
]

const HomeFeatures: React.FC = () => {
  return (
    <section className="py-16 px-4 md:px-20 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          چرا تستولوژی را انتخاب کنیم؟
        </h2>
        <p className="text-gray-600 mb-12 text-base md:text-lg">
          ما فقط تست نمی‌گیریم؛ مسیر رشد ذهنی و روانی شما را هوشمندانه طراحی می‌کنیم.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 text-right bg-gray-50 p-5 rounded-xl shadow-sm border hover:shadow-md transition"
            >
              <CheckCircle className="text-purple-600 w-6 h-6 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeFeatures 