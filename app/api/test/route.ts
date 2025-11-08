import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'API کار می‌کند' 
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ 
      success: true, 
      received: body 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: (error instanceof Error ? error.message : String(error)) 
    }, { status: 500 });
  }
}
















