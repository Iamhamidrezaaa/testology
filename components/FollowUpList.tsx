'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Clock, CheckCircle2, HelpCircle } from 'lucide-react'
import { format } from 'date-fns-jalali'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface FollowUp {
  id: string
  type: 'TEST' | 'PRACTICE'
  relatedSlug: string
  title: string
  description?: string
  dueDate?: string
  done: boolean
  postponed: boolean
  needHelp: boolean
  createdAt: string
  updatedAt: string
}

export function FollowUpList() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const res = await fetch('/api/followup')
        const data = await res.json()
        setFollowUps(data)
      } catch (error) {
        console.error('Error fetching follow-ups:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFollowUps()
  }, [])

  const updateFollowUp = async (id: string, updates: Partial<FollowUp>) => {
    try {
      const res = await fetch('/api/followup', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })
      const updated = await res.json()
      setFollowUps(prev => prev.map(f => f.id === id ? updated : f))
    } catch (error) {
      console.error('Error updating follow-up:', error)
    }
  }

  if (loading) return <div>در حال بارگذاری...</div>
  if (followUps.length === 0) return null

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">پیگیری‌های من</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {followUps.map((followUp) => {
          const isOverdue = followUp.dueDate && new Date(followUp.dueDate) < new Date()
          const isUrgent = isOverdue && !followUp.postponed && !followUp.done

          return (
            <Card
              key={followUp.id}
              className={cn(
                'transition-colors',
                isUrgent && 'border-red-200 bg-red-50',
                followUp.postponed && 'border-yellow-200 bg-yellow-50',
                followUp.done && 'border-green-200 bg-green-50'
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {isUrgent && <AlertTriangle className="w-5 h-5 text-red-500" />}
                      {followUp.postponed && <Clock className="w-5 h-5 text-yellow-500" />}
                      {followUp.done && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      <h3 className="font-semibold">{followUp.title}</h3>
                    </div>
                    {followUp.description && (
                      <p className="text-sm text-gray-600 mt-1">{followUp.description}</p>
                    )}
                    {followUp.dueDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        مهلت: {format(new Date(followUp.dueDate), 'yyyy/MM/dd')}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {!followUp.done && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateFollowUp(followUp.id, { postponed: !followUp.postponed })}
                        >
                          {followUp.postponed ? 'لغو تعویق' : 'تعویق'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateFollowUp(followUp.id, { needHelp: !followUp.needHelp })}
                        >
                          <HelpCircle className="w-4 h-4 ml-1" />
                          {followUp.needHelp ? 'لغو درخواست کمک' : 'نیاز به کمک'}
                        </Button>
                      </>
                    )}
                    <Button
                      variant={followUp.done ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => updateFollowUp(followUp.id, { done: !followUp.done })}
                    >
                      {followUp.done ? 'انجام شده' : 'انجام دادم'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 