import { getAuthSession } from '@/utils/auth'
import { NextApiRequest, NextApiResponse } from 'next'
import type { Suggestion, Reminder } from '@/types/dashboard'

export async function getAuthToken(req: NextApiRequest, res: NextApiResponse): Promise<string | null> {
  const session = await getAuthSession(req, res)
  return session?.user?.id || null
}

export async function getSmartSuggestions(): Promise<Suggestion[]> {
  const response = await fetch('/api/suggestions')
  if (!response.ok) {
    throw new Error('Failed to fetch suggestions')
  }
  return response.json()
}

export async function updateSuggestionStatus(id: string, status: 'pending' | 'in_progress' | 'completed'): Promise<void> {
  const response = await fetch(`/api/suggestions/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update suggestion status')
  }
}

export async function getReminders(): Promise<Reminder[]> {
  const response = await fetch('/api/reminders')
  if (!response.ok) {
    throw new Error('Failed to fetch reminders')
  }
  return response.json()
}

export async function updateReminderStatus(id: string, status: Reminder['status']): Promise<void> {
  const response = await fetch(`/api/reminders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update reminder status')
  }
}