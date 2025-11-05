import { UserPathWithSteps } from '@/types'

export async function fetchUserPath(): Promise<UserPathWithSteps> {
  const res = await fetch('/api/user/path')
  if (!res.ok) {
    throw new Error('خطا در دریافت مسیر رشد')
  }
  return res.json()
}

export async function updateStepStatus(stepId: string, status: 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE'): Promise<void> {
  const res = await fetch(`/api/user/path/step/${stepId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  })

  if (!res.ok) {
    throw new Error('خطا در بروزرسانی وضعیت مرحله')
  }
} 