'use client'

import { Card } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface PopularTest {
  name: string
  count: number
}

interface PopularTestsChartProps {
  data: PopularTest[]
}

export default function PopularTestsChart({ data }: PopularTestsChartProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4">تست‌های محبوب</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
} 