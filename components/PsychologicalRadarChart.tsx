import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface PsychologicalScore {
  stress: number
  focus: number
  selfEsteem: number
  anxiety: number
  anger: number
  depression: number
  happiness: number
  motivation: number
  resilience: number
  socialSkills: number
  emotionalIntelligence: number
  updatedAt: string
}

export default function PsychologicalRadarChart() {
  const [data, setData] = useState<PsychologicalScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true)
        const res = await axios.get('/api/psychological-scores')
        setData(res.data as any)
        setError(null)
      } catch (err) {
        console.error('خطا در دریافت نمرات روان‌شناختی', err)
        setError('خطا در دریافت نمرات روان‌شناختی')
      } finally {
        setLoading(false)
      }
    }
    fetchScores()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>نمودار روان‌شناختی</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-96" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>نمودار روان‌شناختی</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>نمودار روان‌شناختی</CardTitle>
        </CardHeader>
        <CardContent>
          <p>هیچ داده‌ای برای نمایش وجود ندارد</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = [
    { subject: 'استرس', score: data.stress },
    { subject: 'تمرکز', score: data.focus },
    { subject: 'عزت‌نفس', score: data.selfEsteem },
    { subject: 'اضطراب', score: data.anxiety },
    { subject: 'خشم', score: data.anger },
    { subject: 'افسردگی', score: data.depression },
    { subject: 'شادی', score: data.happiness },
    { subject: 'انگیزه', score: data.motivation },
    { subject: 'تاب‌آوری', score: data.resilience },
    { subject: 'مهارت‌های اجتماعی', score: data.socialSkills },
    { subject: 'هوش هیجانی', score: data.emotionalIntelligence }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>نمودار روان‌شناختی</CardTitle>
        <p className="text-sm text-gray-500">
          آخرین به‌روزرسانی: {new Date(data.updatedAt).toLocaleDateString('fa-IR')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-96">
          <ResponsiveContainer>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 10]} />
              <Radar
                name="نمره شما"
                dataKey="score"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px'
                }}
                formatter={(value: number) => [`${value} از 10`, 'نمره']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 