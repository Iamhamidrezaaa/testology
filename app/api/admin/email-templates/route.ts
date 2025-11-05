import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Implement email templates fetching when emailTemplate model is added
    const templates: any[] = [];

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json({ error: 'خطا در دریافت قالب‌های ایمیل' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Implement email template creation when emailTemplate model is added
    return NextResponse.json({ message: 'Email template created' });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json({ error: 'خطا در ایجاد قالب ایمیل' }, { status: 500 });
  }
}