export async function sendEmailOtp(email: string, code: string) {
  console.log(`ارسال ایمیل به ${email}: کد شما ${code}`)
}

export async function sendSmsOtp(phone: string, code: string) {
  console.log(`ارسال پیامک به ${phone}: کد شما ${code}`)
} 