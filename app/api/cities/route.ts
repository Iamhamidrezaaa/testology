import { NextRequest, NextResponse } from 'next/server'

// نمونه داده‌های شهرها (در پروژه واقعی باید از دیتابیس خوانده شود)
const citiesData: { [key: string]: Array<{ id: string; name: string; provinceId: string }> } = {
  '8': [ // تهران
    { id: '801', name: 'تهران', provinceId: '8' },
    { id: '802', name: 'کرج', provinceId: '8' },
    { id: '803', name: 'ورامین', provinceId: '8' },
    { id: '804', name: 'شهریار', provinceId: '8' },
    { id: '805', name: 'ملارد', provinceId: '8' },
    { id: '806', name: 'پاکدشت', provinceId: '8' },
    { id: '807', name: 'دماوند', provinceId: '8' },
    { id: '808', name: 'فیروزکوه', provinceId: '8' }
  ],
  '4': [ // اصفهان
    { id: '401', name: 'اصفهان', provinceId: '4' },
    { id: '402', name: 'کاشان', provinceId: '4' },
    { id: '403', name: 'نجف آباد', provinceId: '4' },
    { id: '404', name: 'خمینی شهر', provinceId: '4' },
    { id: '405', name: 'شاهین شهر', provinceId: '4' },
    { id: '406', name: 'مبارکه', provinceId: '4' }
  ],
  '17': [ // فارس
    { id: '1701', name: 'شیراز', provinceId: '17' },
    { id: '1702', name: 'کازرون', provinceId: '17' },
    { id: '1703', name: 'مرودشت', provinceId: '17' },
    { id: '1704', name: 'جهرم', provinceId: '17' },
    { id: '1705', name: 'فسا', provinceId: '17' }
  ],
  '13': [ // خوزستان
    { id: '1301', name: 'اهواز', provinceId: '13' },
    { id: '1302', name: 'آبادان', provinceId: '13' },
    { id: '1303', name: 'خرمشهر', provinceId: '13' },
    { id: '1304', name: 'دزفول', provinceId: '13' },
    { id: '1305', name: 'شوشتر', provinceId: '13' }
  ],
  '11': [ // خراسان رضوی
    { id: '1101', name: 'مشهد', provinceId: '11' },
    { id: '1102', name: 'نیشابور', provinceId: '11' },
    { id: '1103', name: 'سبزوار', provinceId: '11' },
    { id: '1104', name: 'تربت حیدریه', provinceId: '11' }
  ],
  '25': [ // گیلان
    { id: '2501', name: 'رشت', provinceId: '25' },
    { id: '2502', name: 'بندر انزلی', provinceId: '25' },
    { id: '2503', name: 'لاهیجان', provinceId: '25' },
    { id: '2504', name: 'لنگرود', provinceId: '25' }
  ],
  '27': [ // مازندران
    { id: '2701', name: 'ساری', provinceId: '27' },
    { id: '2702', name: 'بابل', provinceId: '27' },
    { id: '2703', name: 'آمل', provinceId: '27' },
    { id: '2704', name: 'قائمشهر', provinceId: '27' }
  ],
  '21': [ // کرمان
    { id: '2101', name: 'کرمان', provinceId: '21' },
    { id: '2102', name: 'رفسنجان', provinceId: '21' },
    { id: '2103', name: 'جیرفت', provinceId: '21' },
    { id: '2104', name: 'بم', provinceId: '21' }
  ],
  '1': [ // آذربایجان شرقی
    { id: '101', name: 'تبریز', provinceId: '1' },
    { id: '102', name: 'مراغه', provinceId: '1' },
    { id: '103', name: 'میانه', provinceId: '1' },
    { id: '104', name: 'اهر', provinceId: '1' }
  ],
  '2': [ // آذربایجان غربی
    { id: '201', name: 'ارومیه', provinceId: '2' },
    { id: '202', name: 'خوی', provinceId: '2' },
    { id: '203', name: 'مهاباد', provinceId: '2' },
    { id: '204', name: 'بوکان', provinceId: '2' }
  ]
}

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

    const cities = citiesData[provinceId] || []
    
    return NextResponse.json({
      success: true,
      cities
    })
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت لیست شهرها' },
      { status: 500 }
    )
  }
}





