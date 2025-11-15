/**
 * Config استاندارد برای تست MBTI
 * بر اساس Open MBTI / 16Personalities approach
 */

import { ScoringConfig } from '../scoring-engine';

export const MBTI_CONFIG: ScoringConfig = {
  type: 'mbti',
  dimensions: ['E/I', 'S/N', 'T/F', 'J/P'],
  weighting: {
    'strongly_disagree': -2,
    'disagree': -1,
    'neutral': 0,
    'agree': +1,
    'strongly_agree': +2,
  },
};

/**
 * لیست سوالات MBTI با dimension و reverse status
 * این لیست باید با سوالات موجود در دیتابیس هماهنگ باشد
 */
export interface MBTIQuestionMapping {
  questionOrder: number;
  dimension: 'E/I' | 'S/N' | 'T/F' | 'J/P';
  isReverse: boolean;
}

/**
 * مثال mapping برای MBTI (باید با سوالات واقعی دیتابیس هماهنگ شود)
 * این فقط یک نمونه است - باید با سوالات واقعی جایگزین شود
 */
export const MBTI_QUESTION_MAPPING: MBTIQuestionMapping[] = [
  // بعد E/I
  { questionOrder: 1, dimension: 'E/I', isReverse: false },
  { questionOrder: 2, dimension: 'E/I', isReverse: true },
  { questionOrder: 3, dimension: 'E/I', isReverse: false },
  // ... بقیه سوالات
  
  // بعد S/N
  { questionOrder: 10, dimension: 'S/N', isReverse: false },
  { questionOrder: 11, dimension: 'S/N', isReverse: true },
  // ... بقیه سوالات
  
  // بعد T/F
  { questionOrder: 20, dimension: 'T/F', isReverse: false },
  { questionOrder: 21, dimension: 'T/F', isReverse: true },
  // ... بقیه سوالات
  
  // بعد J/P
  { questionOrder: 30, dimension: 'J/P', isReverse: false },
  { questionOrder: 31, dimension: 'J/P', isReverse: true },
  // ... بقیه سوالات
];

/**
 * تفسیر نوع شخصیتی MBTI
 */
export const MBTI_TYPE_DESCRIPTIONS: Record<string, string> = {
  'INTJ': 'معمار - استراتژیست منطقی و مستقل',
  'INTP': 'منطق‌گرا - متفکر خلاق و نوآور',
  'ENTJ': 'فرمانده - رهبر طبیعی و قاطع',
  'ENTP': 'مجادله‌گر - نوآور باهوش و جسور',
  'INFJ': 'مدافع - ایده‌آل‌گرای خلاق و مصمم',
  'INFP': 'میانجی - شاعر مهربان و خوش‌بین',
  'ENFJ': 'قهرمان - رهبر کاریزماتیک و الهام‌بخش',
  'ENFP': 'مبارز - ماجراجوی آزاد و مشتاق',
  'ISTJ': 'منطقی - فردی قابل اعتماد و عملی',
  'ISFJ': 'مدافع - محافظ دلسوز و متعهد',
  'ESTJ': 'اجراکننده - مدیر کارآمد و منظم',
  'ESFJ': 'قنصل - مراقب دلسوز و اجتماعی',
  'ISTP': 'ماهر - ماجراجوی جسور و عملی',
  'ISFP': 'هنرمند - هنرمند انعطاف‌پذیر و مهربان',
  'ESTP': 'کارآفرین - کارآفرین باهوش و پرانرژی',
  'ESFP': 'سرگرم‌کننده - سرگرم‌کننده آزاد و شاد',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getMBTIConfigJSON(): string {
  return JSON.stringify(MBTI_CONFIG);
}

