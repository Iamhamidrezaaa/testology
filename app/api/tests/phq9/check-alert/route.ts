import { NextRequest, NextResponse } from 'next/server';
import { checkPHQ9SuicideAlert } from '@/lib/test-configs/phq9-config';

/**
 * POST /api/tests/phq9/check-alert
 * بررسی alert برای سوال 9 (افکار خودکشی) در PHQ-9
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question9Score } = body;

    if (question9Score === undefined || question9Score === null) {
      return NextResponse.json(
        { error: 'question9Score الزامی است' },
        { status: 400 }
      );
    }

    const alert = checkPHQ9SuicideAlert(question9Score);

    return NextResponse.json({
      success: true,
      alert,
    });

  } catch (error) {
    console.error('Error checking PHQ-9 alert:', error);
    return NextResponse.json(
      { error: 'خطا در بررسی alert' },
      { status: 500 }
    );
  }
}

