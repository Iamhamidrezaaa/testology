'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
import localFont from 'next/font/local'
import type { MoodEntry } from '@/types/dashboard'

// ثبت پلاگین تاریخ شمسی برای dayjs
dayjs.extend(jalaliday)

// لود فونت وزیر از مسیر public/fonts
const vazirFont = localFont({
  src: '../../public/fonts/Vazir.woff2',
  display: 'swap',
})

interface MoodChartProps {
  data: MoodEntry[]
}

export default function MoodChart({ data }: MoodChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // تبدیل تاریخ‌ها به شمسی
    const transformed = data.map((item) => ({
      ...item,
      date: dayjs(item.date).calendar('jalali').locale('fa').format('YYYY/MM/DD')
    }))
    setChartData(transformed)
  }, [data])

  return (
    <div className={`w-full h-96 bg-white p-4 rounded-xl shadow ${vazirFont.className}`} dir="rtl">
      <h3 className="text-xl font-bold mb-4 text-right">نمودار تغییرات وضعیت روانی</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            angle={-30} 
            textAnchor="end" 
          />
          <YAxis 
            domain={[0, 10]} 
            tick={{ fontSize: 12 }} 
          />
          <Tooltip
            formatter={(value: number) => `${value} از ۱۰`} 
            labelFormatter={(label: string) => `تاریخ: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="moodScore" 
            stroke="#8884d8" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 