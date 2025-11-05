'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'

interface ChartMoodProps {
  data: Array<{
    date: string
    tests: number
    averageScore: number
    mood: string | null
    moodValue: number
  }>
}

export default function ChartMood({ data }: ChartMoodProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="h-64 flex items-center justify-center">
        <CardContent className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد</p>
        </CardContent>
      </Card>
    )
  }

  // فرمت کردن داده‌ها برای نمودار
  const chartData = data.map(item => ({
    ...item,
    dateFormatted: new Date(item.date).toLocaleDateString('fa-IR', { 
      month: 'short', 
      day: 'numeric' 
    }),
    moodDisplay: item.mood || '❓'
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.dateFormatted}</p>
          <p className="text-blue-600">تست‌ها: {data.tests}</p>
          <p className="text-green-600">میانگین امتیاز: {data.averageScore.toFixed(1)}</p>
          <p className="text-purple-600">احساس: {data.moodDisplay}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="dateFormatted" 
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* خط تست‌ها */}
          <Line
            type="monotone"
            dataKey="tests"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            name="تعداد تست‌ها"
          />
          
          {/* خط میانگین امتیاز */}
          <Line
            type="monotone"
            dataKey="averageScore"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            name="میانگین امتیاز"
          />
          
          {/* خط احساسات */}
          <Line
            type="monotone"
            dataKey="moodValue"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            name="سطح احساس"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
















