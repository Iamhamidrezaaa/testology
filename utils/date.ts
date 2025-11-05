import { format, isAfter, isBefore, addDays } from 'date-fns-jalali'

export function formatJalaliDate(date: string | Date): string {
  return format(new Date(date), 'yyyy/MM/dd')
}

export function isOverdue(date: string | Date): boolean {
  const today = new Date()
  return isBefore(new Date(date), today)
}

export function isUpcoming(date: string | Date, days: number = 7): boolean {
  const today = new Date()
  const futureDate = addDays(today, days)
  return isAfter(new Date(date), today) && isBefore(new Date(date), futureDate)
}

export function getDaysRemaining(date: string | Date): number {
  const today = new Date()
  const targetDate = new Date(date)
  const diffTime = targetDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
} 
