import axios from 'axios'

interface SMSOptions {
  to: string
  message?: string
  templateId?: string
  parameters?: Record<string, string>
}

interface SMSResponse {
  success: boolean
  messageId?: string
  error?: string
}

interface SmsResponse {
  status: number
  message: string
  data: {
    messageId: string
    status: string
  }
}

// تنظیمات SMS.ir
const SMS_IR_CONFIG = {
  apiKey: process.env.SMS_IR_API_KEY,
  lineNumber: '300021150351', // شماره اختصاصی شما
  baseUrl: 'https://api.sms.ir/v1',
  templateId: '123456' // آیدی قالب موقت - بعدا باید تغییر کند
}

// بررسی فعال بودن SMS.ir
const isSMSIrEnabled = () => {
  return Boolean(SMS_IR_CONFIG.apiKey)
}

// ارسال پیامک با SMS.ir
async function sendWithSMSIr({ to, message, templateId, parameters }: SMSOptions): Promise<SMSResponse> {
  try {
    if (!isSMSIrEnabled()) {
      throw new Error('SMS.ir is not configured')
    }

    const endpoint = templateId 
      ? `${SMS_IR_CONFIG.baseUrl}/send/verify`
      : `${SMS_IR_CONFIG.baseUrl}/send`

    const payload = templateId
      ? {
          mobile: to,
          templateId: templateId || SMS_IR_CONFIG.templateId,
          parameters: parameters ? Object.entries(parameters).map(([name, value]) => ({ name, value })) : []
        }
      : {
          messages: [message || ''],
          mobileNumbers: [to],
          lineNumber: SMS_IR_CONFIG.lineNumber
        }

    const response = await axios.post<SmsResponse>(endpoint, payload, {
      headers: {
        'X-API-KEY': SMS_IR_CONFIG.apiKey,
        'Content-Type': 'application/json'
      }
    })

    return {
      success: true,
      messageId: response.data.data.messageId
    }
  } catch (error) {
    console.error('SMS.ir error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// ارسال پیامک با سیستم پیش‌فرض (برای محیط توسعه)
async function sendWithDefault({ to, message }: SMSOptions): Promise<SMSResponse> {
  console.log('SMS would be sent:', { to, message })
  return { success: true }
}

// تابع اصلی ارسال پیامک
export async function sendSMS(options: SMSOptions): Promise<SMSResponse> {
  try {
    if (isSMSIrEnabled()) {
      return await sendWithSMSIr(options)
    } else {
      return await sendWithDefault(options)
    }
  } catch (error) {
    console.error('Error sending SMS:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// تابع کمکی برای ارسال پیامک‌های سیستمی
export async function sendSystemSMS({ to, message }: SMSOptions): Promise<void> {
  try {
    const result = await sendSMS({ to, message })
    if (!result.success) {
      throw new Error(result.error || 'خطا در ارسال پیامک')
    }
  } catch (error) {
    console.error('خطا در ارسال پیامک:', error)
    throw error
  }
}

// تابع ارسال کد تایید
export async function sendVerificationSMS(to: string, code: string): Promise<SMSResponse> {
  return sendSMS({
    to,
    templateId: SMS_IR_CONFIG.templateId,
    parameters: {
      Code: code
    }
  })
}

export async function sendSms(phoneNumber: string, message: string) {
  try {
    const response = await axios.post<SmsResponse>('/api/sms/send', {
      phoneNumber,
      message
    })

    return response.data
  } catch (error) {
    console.error('Error sending SMS:', error)
    throw error
  }
} 