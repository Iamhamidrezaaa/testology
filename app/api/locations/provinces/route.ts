import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // لیست استان‌های ایران
    const provinces = [
      { id: '1', name: 'آذربایجان شرقی', cities: [] },
      { id: '2', name: 'آذربایجان غربی', cities: [] },
      { id: '3', name: 'اردبیل', cities: [] },
      { id: '4', name: 'اصفهان', cities: [] },
      { id: '5', name: 'البرز', cities: [] },
      { id: '6', name: 'ایلام', cities: [] },
      { id: '7', name: 'بوشهر', cities: [] },
      { id: '8', name: 'تهران', cities: [] },
      { id: '9', name: 'چهارمحال و بختیاری', cities: [] },
      { id: '10', name: 'خراسان جنوبی', cities: [] },
      { id: '11', name: 'خراسان رضوی', cities: [] },
      { id: '12', name: 'خراسان شمالی', cities: [] },
      { id: '13', name: 'خوزستان', cities: [] },
      { id: '14', name: 'زنجان', cities: [] },
      { id: '15', name: 'سمنان', cities: [] },
      { id: '16', name: 'سیستان و بلوچستان', cities: [] },
      { id: '17', name: 'فارس', cities: [] },
      { id: '18', name: 'قزوین', cities: [] },
      { id: '19', name: 'قم', cities: [] },
      { id: '20', name: 'کردستان', cities: [] },
      { id: '21', name: 'کرمان', cities: [] },
      { id: '22', name: 'کرمانشاه', cities: [] },
      { id: '23', name: 'کهگیلویه و بویراحمد', cities: [] },
      { id: '24', name: 'گلستان', cities: [] },
      { id: '25', name: 'گیلان', cities: [] },
      { id: '26', name: 'لرستان', cities: [] },
      { id: '27', name: 'مازندران', cities: [] },
      { id: '28', name: 'مرکزی', cities: [] },
      { id: '29', name: 'هرمزگان', cities: [] },
      { id: '30', name: 'همدان', cities: [] },
      { id: '31', name: 'یزد', cities: [] }
    ]

    return NextResponse.json({
      success: true,
      provinces: provinces
    })
    
  } catch (error) {
    console.error('Error fetching provinces:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت لیست استان‌ها' },
      { status: 500 }
    )
  }
}






