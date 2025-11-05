import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { google } from 'googleapis'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const accessToken = searchParams.get('accessToken')
    const timeMin = searchParams.get('timeMin')
    const timeMax = searchParams.get('timeMax')

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
      access_token: accessToken
    })

    const calendar = google.calendar({ version: 'v3', auth })

    // دریافت رویدادهای تقویم
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 روز آینده
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime'
    })

    const events = response.data.items || []

    // فیلتر کردن رویدادهای مربوط به Testology
    const testologyEvents = events.filter(event => 
      event.summary?.includes('جلسه روان‌درمانی') || 
      event.summary?.includes('تمرین هفتگی') ||
      event.description?.includes('Testology')
    )

    return NextResponse.json({
      events: testologyEvents,
      totalEvents: events.length,
      testologyEvents: testologyEvents.length
    })

  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { accessToken, title, description, startTime, endTime, location } = await req.json()

    if (!accessToken || !title || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // تنظیم OAuth2
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    auth.setCredentials({
      access_token: accessToken
    })

    const calendar = google.calendar({ version: 'v3', auth })

    // ایجاد رویداد جدید
    const event = {
      summary: title,
      description: description || '',
      start: {
        dateTime: startTime,
        timeZone: 'Asia/Tehran'
      },
      end: {
        dateTime: endTime,
        timeZone: 'Asia/Tehran'
      },
      location: location || '',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 15 }
        ]
      }
    }

    const createdEvent = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    })

    return NextResponse.json({
      success: true,
      event: createdEvent.data
    })

  } catch (error) {
    console.error('Error creating calendar event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















