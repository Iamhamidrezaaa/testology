import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'

const PopularTestsSection: React.FC = () => {
  const tests = [
    {
      title: 'تست MBTI',
      description: 'شناخت تیپ شخصیتی و سبک ارتباطی شما',
      slug: 'mbti',
    },
    {
      title: 'تست افسردگی PHQ-9',
      description: 'ارزیابی سطح افسردگی طی دو هفته گذشته',
      slug: 'phq9',
    },
    {
      title: 'تست اضطراب GAD-7',
      description: 'تحلیل میزان اضطراب مزمن و تاثیرات آن',
      slug: 'gad7',
    },
  ]

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <Star className="text-yellow-400 w-6 h-6" />
        تست‌های محبوب کاربران
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tests.map((test) => (
          <Card key={test.slug} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-xl font-semibold text-indigo-600">{test.title}</h3>
              <p className="text-sm text-muted-foreground">{test.description}</p>
              <Link
                href={`/tests/${test.slug}`}
                className="inline-block text-indigo-700 text-sm mt-2 hover:underline"
              >
                شروع تست →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default PopularTestsSection 