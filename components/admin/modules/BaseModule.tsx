'use client'

import { Card } from '@/components/ui/card'

interface BaseModuleProps {
  title: string
  children: React.ReactNode
}

export default function BaseModule({ title, children }: BaseModuleProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Card className="p-6">
        {children}
      </Card>
    </div>
  )
} 