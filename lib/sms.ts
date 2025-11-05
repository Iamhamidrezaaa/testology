// شبیه‌سازی سرویس پیامک
// در نسخه واقعی، این فایل به سرویس‌های SMS مثل کاوه‌پیام، پیامک، یا Twilio وصل می‌شود

export interface SmsMessage {
  to: string;
  message: string;
  type?: 'booking_confirmation' | 'reminder' | 'cancellation';
}

export async function sendSms(to: string, message: string, type?: string): Promise<boolean> {
  try {
    // شبیه‌سازی ارسال پیامک
    console.log(`📱 SMS Sent to ${to}:`);
    console.log(`📝 Message: ${message}`);
    console.log(`🏷️ Type: ${type || 'general'}`);
    console.log(`⏰ Time: ${new Date().toLocaleString('fa-IR')}`);
    console.log('─'.repeat(50));

    // در نسخه واقعی، اینجا کد ارسال پیامک واقعی قرار می‌گیرد
    // مثال:
    // const response = await fetch('https://api.sms-provider.com/send', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${process.env.SMS_API_KEY}` },
    //   body: JSON.stringify({ to, message })
    // });
    
    return true;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
}

export async function sendBookingConfirmation(userId: string, therapistName: string, date: string, time: string): Promise<boolean> {
  const message = `✅ رزرو جلسه شما با ${therapistName} تأیید شد.\n📅 تاریخ: ${date}\n🕐 ساعت: ${time}\n\nبا تشکر از انتخاب Testology`;
  
  return await sendSms(userId, message, 'booking_confirmation');
}

export async function sendTherapistNotification(therapistId: string, userName: string, date: string, time: string): Promise<boolean> {
  const message = `🔔 جلسه جدید رزرو شد!\n👤 بیمار: ${userName}\n📅 تاریخ: ${date}\n🕐 ساعت: ${time}\n\nلطفاً در Therapist Portal خود بررسی کنید.`;
  
  return await sendSms(therapistId, message, 'booking_confirmation');
}

export async function sendSessionReminder(userId: string, therapistName: string, date: string, time: string): Promise<boolean> {
  const message = `⏰ یادآوری جلسه فردا\n👩‍⚕️ درمانگر: ${therapistName}\n📅 تاریخ: ${date}\n🕐 ساعت: ${time}\n\nلطفاً ۱۰ دقیقه قبل از جلسه آماده باشید.`;
  
  return await sendSms(userId, message, 'reminder');
}











