import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const provinceId = searchParams.get('provinceId')
    
    if (!provinceId) {
      return NextResponse.json(
        { success: false, message: 'شناسه استان مورد نیاز است' },
        { status: 400 }
      )
    }

    // شهرستان‌های هر استان
    const citiesByProvince: { [key: string]: Array<{id: string, name: string, provinceId: string}> } = {
      '1': [ // آذربایجان شرقی
        { id: '1-1', name: 'تبریز', provinceId: '1' },
        { id: '1-2', name: 'مراغه', provinceId: '1' },
        { id: '1-3', name: 'میانه', provinceId: '1' },
        { id: '1-4', name: 'شبستر', provinceId: '1' },
        { id: '1-5', name: 'اهر', provinceId: '1' },
        { id: '1-6', name: 'بناب', provinceId: '1' },
        { id: '1-7', name: 'سراب', provinceId: '1' },
        { id: '1-8', name: 'هشترود', provinceId: '1' }
      ],
      '2': [ // آذربایجان غربی
        { id: '2-1', name: 'ارومیه', provinceId: '2' },
        { id: '2-2', name: 'خوی', provinceId: '2' },
        { id: '2-3', name: 'مهاباد', provinceId: '2' },
        { id: '2-4', name: 'بوکان', provinceId: '2' },
        { id: '2-5', name: 'سلماس', provinceId: '2' },
        { id: '2-6', name: 'نقده', provinceId: '2' },
        { id: '2-7', name: 'سردشت', provinceId: '2' },
        { id: '2-8', name: 'پیرانشهر', provinceId: '2' }
      ],
      '8': [ // تهران
        { id: '8-1', name: 'تهران', provinceId: '8' },
        { id: '8-2', name: 'کرج', provinceId: '8' },
        { id: '8-3', name: 'ورامین', provinceId: '8' },
        { id: '8-4', name: 'شهریار', provinceId: '8' },
        { id: '8-5', name: 'ملارد', provinceId: '8' },
        { id: '8-6', name: 'رباط کریم', provinceId: '8' },
        { id: '8-7', name: 'بهارستان', provinceId: '8' },
        { id: '8-8', name: 'پاکدشت', provinceId: '8' },
        { id: '8-9', name: 'دماوند', provinceId: '8' },
        { id: '8-10', name: 'فیروزکوه', provinceId: '8' }
      ],
      '17': [ // فارس
        { id: '17-1', name: 'شیراز', provinceId: '17' },
        { id: '17-2', name: 'کازرون', provinceId: '17' },
        { id: '17-3', name: 'جهرم', provinceId: '17' },
        { id: '17-4', name: 'فسا', provinceId: '17' },
        { id: '17-5', name: 'داراب', provinceId: '17' },
        { id: '17-6', name: 'لارستان', provinceId: '17' },
        { id: '17-7', name: 'مرودشت', provinceId: '17' },
        { id: '17-8', name: 'فیروزآباد', provinceId: '17' },
        { id: '17-9', name: 'استهبان', provinceId: '17' },
        { id: '17-10', name: 'لامرد', provinceId: '17' }
      ],
      '13': [ // خوزستان
        { id: '13-1', name: 'اهواز', provinceId: '13' },
        { id: '13-2', name: 'آبادان', provinceId: '13' },
        { id: '13-3', name: 'خرمشهر', provinceId: '13' },
        { id: '13-4', name: 'دزفول', provinceId: '13' },
        { id: '13-5', name: 'شوش', provinceId: '13' },
        { id: '13-6', name: 'اندیمشک', provinceId: '13' },
        { id: '13-7', name: 'ایذه', provinceId: '13' },
        { id: '13-8', name: 'شادگان', provinceId: '13' },
        { id: '13-9', name: 'مسجدسلیمان', provinceId: '13' },
        { id: '13-10', name: 'بندر ماهشهر', provinceId: '13' }
      ],
      '4': [ // اصفهان
        { id: '4-1', name: 'اصفهان', provinceId: '4' },
        { id: '4-2', name: 'کاشان', provinceId: '4' },
        { id: '4-3', name: 'نجف آباد', provinceId: '4' },
        { id: '4-4', name: 'خمینی شهر', provinceId: '4' },
        { id: '4-5', name: 'شهرضا', provinceId: '4' },
        { id: '4-6', name: 'لنجان', provinceId: '4' },
        { id: '4-7', name: 'مبارکه', provinceId: '4' },
        { id: '4-8', name: 'اردستان', provinceId: '4' },
        { id: '4-9', name: 'نطنز', provinceId: '4' },
        { id: '4-10', name: 'خوانسار', provinceId: '4' }
      ],
      '11': [ // خراسان رضوی
        { id: '11-1', name: 'مشهد', provinceId: '11' },
        { id: '11-2', name: 'نیشابور', provinceId: '11' },
        { id: '11-3', name: 'تربت حیدریه', provinceId: '11' },
        { id: '11-4', name: 'کاشمر', provinceId: '11' },
        { id: '11-5', name: 'سبزوار', provinceId: '11' },
        { id: '11-6', name: 'تربت جام', provinceId: '11' },
        { id: '11-7', name: 'قوچان', provinceId: '11' },
        { id: '11-8', name: 'کلات', provinceId: '11' },
        { id: '11-9', name: 'فریمان', provinceId: '11' },
        { id: '11-10', name: 'چناران', provinceId: '11' }
      ],
      '25': [ // گیلان
        { id: '25-1', name: 'رشت', provinceId: '25' },
        { id: '25-2', name: 'بندر انزلی', provinceId: '25' },
        { id: '25-3', name: 'لاهیجان', provinceId: '25' },
        { id: '25-4', name: 'لنگرود', provinceId: '25' },
        { id: '25-5', name: 'رودسر', provinceId: '25' },
        { id: '25-6', name: 'آستارا', provinceId: '25' },
        { id: '25-7', name: 'تالش', provinceId: '25' },
        { id: '25-8', name: 'فومن', provinceId: '25' },
        { id: '25-9', name: 'صومعه سرا', provinceId: '25' },
        { id: '25-10', name: 'آمل', provinceId: '25' }
      ],
      '27': [ // مازندران
        { id: '27-1', name: 'ساری', provinceId: '27' },
        { id: '27-2', name: 'بابل', provinceId: '27' },
        { id: '27-3', name: 'آمل', provinceId: '27' },
        { id: '27-4', name: 'قائمشهر', provinceId: '27' },
        { id: '27-5', name: 'بابلسر', provinceId: '27' },
        { id: '27-6', name: 'نوشهر', provinceId: '27' },
        { id: '27-7', name: 'تنکابن', provinceId: '27' },
        { id: '27-8', name: 'رامسر', provinceId: '27' },
        { id: '27-9', name: 'نکا', provinceId: '27' },
        { id: '27-10', name: 'فریدونکنار', provinceId: '27' }
      ]
    }

    const cities = citiesByProvince[provinceId] || []

    return NextResponse.json({
      success: true,
      cities: cities
    })
    
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت لیست شهرستان‌ها' },
      { status: 500 }
    )
  }
}






