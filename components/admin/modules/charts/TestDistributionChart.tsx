'use client'

import { Card } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface TestCategory {
  category: string
  count: number
}

interface TestDistributionChartProps {
  data: TestCategory[]
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function TestDistributionChart({ data }: TestDistributionChartProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4">توزیع تست‌ها بر اساس دسته‌بندی</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
} 