import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { google } from 'googleapis'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { accessToken, refreshToken } = await req.json()

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token required' }, { status: 400 })
    }

    // تنظیم OAuth2
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    })

    const calendar = google.calendar({ version: 'v3', auth })

    // TherapySession model exists but doesn't have therapist relation
    // Returning empty array for now
    const therapistSessions: any[] = []

    // weeklyAssignment model doesn't exist in schema
    const weeklyAssignments: any[] = []

    const syncedEvents = []

    // همگام‌سازی جلسات درمانگر - skipping as therapistSessions is empty
    // TherapySession model doesn't have the required fields

    // همگام‌سازی تمرین‌های هفتگی
    for (const assignment of weeklyAssignments) {
      if (assignment.status === 'assigned' || assignment.status === 'in_progress') {
        // محاسبه تاریخ شروع هفته
        const startOfWeek = new Date()
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1) // دوشنبه
        startOfWeek.setHours(9, 0, 0, 0) // 9 صبح

        const event = {
          summary: `تمرین هفتگی: ${assignment.title}`,
          description: `${assignment.description}\n\nوضعیت: ${assignment.status}\n${assignment.note || ''}`,
          start: {
            dateTime: startOfWeek.toISOString(),
            timeZone: 'Asia/Tehran'
          },
          end: {
            dateTime: new Date(startOfWeek.getTime() + 60 * 60000).toISOString(), // 1 ساعت
            timeZone: 'Asia/Tehran'
          },
          colorId: '2', // سبز برای تمرین‌ها
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 15 } // 15 دقیقه قبل
            ]
          }
        }

        try {
          const createdEvent = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event as any
          })

          syncedEvents.push({
            type: 'assignment',
            id: assignment.id,
            googleEventId: createdEvent.data.id,
            title: event.summary
          })
        } catch (error) {
          console.error('Error creating calendar event for assignment:', error)
        }
      }
    }

    return NextResponse.json({
      success: true,
      syncedEvents,
      totalEvents: syncedEvents.length,
      sessionsCount: syncedEvents.filter(e => e.type === 'session').length,
      assignmentsCount: syncedEvents.filter(e => e.type === 'assignment').length
    })

  } catch (error) {
    console.error('Error syncing calendar:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















