import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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

    // دریافت جلسات درمانگر کاربر
    const therapistSessions = await prisma.therapistSession.findMany({
      where: { patientId: session.user.id },
      include: {
        therapist: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    // دریافت تمرین‌های هفتگی
    const weeklyAssignments = await prisma.weeklyAssignment.findMany({
      where: { userId: session.user.id }
    })

    const syncedEvents = []

    // همگام‌سازی جلسات درمانگر
    for (const session of therapistSessions) {
      const event = {
        summary: `جلسه روان‌درمانی - ${session.therapist.user.name}`,
        description: `جلسه هفتگی با ${session.therapist.user.name}\n${session.note || ''}`,
        start: {
          dateTime: session.date.toISOString(),
          timeZone: 'Asia/Tehran'
        },
        end: {
          dateTime: new Date(session.date.getTime() + session.duration * 60000).toISOString(),
          timeZone: 'Asia/Tehran'
        },
        location: session.meetingLink || 'جلسه آنلاین',
        attendees: [
          {
            email: session.therapist.user.email,
            displayName: session.therapist.user.name
          }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 ساعت قبل
            { method: 'popup', minutes: 30 } // 30 دقیقه قبل
          ]
        }
      }

      try {
        const createdEvent = await calendar.events.insert({
          calendarId: 'primary',
          resource: event
        })

        syncedEvents.push({
          type: 'session',
          id: session.id,
          googleEventId: createdEvent.data.id,
          title: event.summary
        })
      } catch (error) {
        console.error('Error creating calendar event for session:', error)
      }
    }

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
            resource: event
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
















