'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface ChartData {
  date: string
  score: number
  testName: string
  category: string
}

interface MentalHealthChartProps {
  data: ChartData[]
  type?: 'line' | 'area'
  height?: number
}

export function MentalHealthChart({ data, type = 'line', height = 300 }: MentalHealthChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`تاریخ: ${label}`}</p>
          <p className="text-blue-600">{`امتیاز: ${payload[0].value}`}</p>
          <p className="text-gray-600 text-sm">{`تست: ${payload[0].payload.testName}`}</p>
        </div>
      )
    }
    return null
  }

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorScore)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#e5e7eb' }}
          tickLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#e5e7eb' }}
          tickLine={{ stroke: '#e5e7eb' }}
        />
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke="#8884d8" 
          strokeWidth={3}
          dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
          activeDot={{ r: 8, stroke: '#8884d8', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

















