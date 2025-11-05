import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { faIR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * تبدیل تاریخ به فرمت فارسی
 * @param date تاریخ مورد نظر
 * @returns تاریخ به فرمت فارسی
 */
export function formatDate(date: string | Date) {
  return format(new Date(date), 'dd MMMM yyyy', { locale: faIR })
}

export function generateOtp(length = 5) {
  return Math.floor(10000 + Math.random() * 90000).toString()
} 