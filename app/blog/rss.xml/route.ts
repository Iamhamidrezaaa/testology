import { NextRequest, NextResponse } from 'next/server'
import { generateBlogRSSFeed } from '@/lib/blog/blog-sitemap'

export async function GET(request: NextRequest) {
  try {
    const rss = await generateBlogRSSFeed()
    
    return new NextResponse(rss, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}
















