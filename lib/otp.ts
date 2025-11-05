export function generateOTP(): string {
  // تولید یک کد ۶ رقمی تصادفی
  return Math.floor(100000 + Math.random() * 900000).toString()
} 