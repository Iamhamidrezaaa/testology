import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const { userId } = await request.json()
    if (!userId) return new Response(JSON.stringify({ error: 'userId لازم است' }), { status: 400 })

    // فقط ادمین یا مشاور مجاز است
    if (!(session.user.role === 'admin' || session.user.role === 'therapist')) {
      return new Response(JSON.stringify({ error: 'دسترسی غیرمجاز' }), { status: 403 })
    }

    // جمع‌آوری نتایج اخیر
    const results = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { testName: true, testSlug: true, type: true, score: true, totalScore: true, result: true, createdAt: true }
    })

    const summaryLines = results.map(r => `- ${r.testName} (${r.testSlug ?? r.type}): score=${r.score ?? '-'} / ${r.totalScore ?? '-'} | note=${r.result?.slice(0,120) ?? ''}`)
    const summary = summaryLines.join('\n') || 'No previous tests.'

    const prompt = `You are a mental health assistant. A user has completed the following psychological tests with their results:\n\n${summary}\n\nBased on these, suggest 2 to 3 next psychological tests the user should take, and explain briefly why.\n\nFormat your output as:\n[\n  { "name": "Test Name", "reason": "Short reason" },\n  ...\n]`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful, concise assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.6,
    })

    const content = completion.choices[0]?.message?.content ?? '[]'
    // تلاش برای parse امن
    let suggestions: Array<{ name: string; reason: string }>
    try { suggestions = JSON.parse(content) } catch { suggestions = [] }

    // فیلتر و نرمال‌سازی خروجی
    suggestions = (suggestions || [])
      .filter(x => x && typeof x.name === 'string' && typeof x.reason === 'string')
      .slice(0, 3)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('suggest-next-tests error:', error)
    return new Response(JSON.stringify({ error: 'خطای داخلی سرور' }), { status: 500 })
  }
}























