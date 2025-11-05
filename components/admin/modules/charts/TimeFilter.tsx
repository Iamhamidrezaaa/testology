'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type TimeRange = 'day' | 'week' | 'month' | 'year'

interface TimeFilterProps {
  selectedRange: TimeRange
  onRangeChange: (range: TimeRange) => void
}

export default function TimeFilter({ selectedRange, onRangeChange }: TimeFilterProps) {
  const ranges: { value: TimeRange; label: string }[] = [
    { value: 'day', label: 'امروز' },
    { value: 'week', label: 'هفته' },
    { value: 'month', label: 'ماه' },
    { value: 'year', label: 'سال' }
  ]

  return (
    <div className="flex space-x-2 space-x-reverse">
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant={selectedRange === range.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onRangeChange(range.value)}
          className={cn(
            'min-w-[80px]',
            selectedRange === range.value && 'bg-primary text-primary-foreground'
          )}
        >
          {range.label}
        </Button>
      ))}
    </div>
  )
} 