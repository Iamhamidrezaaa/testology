import { format } from 'date-fns-jalali'
import { faIR } from 'date-fns-jalali/locale'

export function formatJalaliDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'yyyy/MM/dd', { locale: faIR })
} 