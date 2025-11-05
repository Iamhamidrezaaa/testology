import { NextRequest, NextResponse } from 'next/server'

export async function handleApiRequest(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  try {
    return await handler(req)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'خطا در پردازش درخواست' },
      { status: 500 }
    )
  }
}

export function validateTestData(data: any) {
  const { title, description, questions, category } = data
  
  if (!title || !description || !questions || !category) {
    throw new Error('تمام فیلدها الزامی است')
  }
  
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('سوالات باید آرایه‌ای غیرخالی باشد')
  }
  
  return true
}

export function validateUserData(data: any) {
  const { name, email, role } = data
  
  if (!name || !email || !role) {
    throw new Error('نام، ایمیل و نقش الزامی است')
  }
  
  if (!['admin', 'user'].includes(role)) {
    throw new Error('نقش باید admin یا user باشد')
  }
  
  return true
}

export function formatApiResponse(data: any, message?: string) {
  return {
    success: true,
    data,
    message: message || 'عملیات با موفقیت انجام شد',
    timestamp: new Date().toISOString()
  }
}