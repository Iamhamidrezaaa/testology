// متادیتای اختصاصی هر تست
export interface TestMetadata {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  ogImage: string;
  canonical: string;
  twitterCard: 'summary' | 'summary_large_image';
  structuredData?: any;
}

export const testMetadata: Record<string, TestMetadata> = {
  'self-esteem': {
    id: 'self-esteem',
    slug: 'self-esteem',
    title: 'تست عزت نفس روزنبرگ | ارزیابی رایگان عزت نفس',
    description: 'تست عزت نفس روزنبرگ به شما کمک می‌کند تا سطح عزت نفس خود را ارزیابی کنید. این تست معتبر و رایگان است.',
    category: 'personality',
    keywords: ['تست عزت نفس', 'روزنبرگ', 'ارزیابی شخصیت', 'تست روانشناسی', 'عزت نفس'],
    ogImage: '/images/tests/self-esteem-og.jpg',
    canonical: '/tests/self-esteem',
    twitterCard: 'summary_large_image',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "PsychologicalTest",
      "name": "تست عزت نفس روزنبرگ",
      "description": "تست عزت نفس روزنبرگ برای ارزیابی سطح عزت نفس",
      "url": "/tests/self-esteem",
      "provider": {
        "@type": "Organization",
        "name": "تستولوژی"
      }
    }
  },
  'stress': {
    id: 'stress',
    slug: 'stress',
    title: 'تست استرس ادراک‌شده PSS | ارزیابی سطح استرس',
    description: 'تست استرس ادراک‌شده (PSS) به شما کمک می‌کند تا میزان استرس خود را اندازه‌گیری کنید.',
    category: 'mental-health',
    keywords: ['تست استرس', 'PSS', 'استرس ادراک‌شده', 'تست روانشناسی', 'ارزیابی استرس'],
    ogImage: '/images/tests/stress-og.jpg',
    canonical: '/tests/stress',
    twitterCard: 'summary_large_image',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "PsychologicalTest",
      "name": "تست استرس ادراک‌شده PSS",
      "description": "تست استرس ادراک‌شده برای ارزیابی سطح استرس",
      "url": "/tests/stress",
      "provider": {
        "@type": "Organization",
        "name": "تستولوژی"
      }
    }
  },
  'anxiety': {
    id: 'anxiety',
    slug: 'anxiety',
    title: 'تست اضطراب GAD-7 | ارزیابی اضطراب عمومی',
    description: 'تست اضطراب GAD-7 برای تشخیص و ارزیابی اختلال اضطراب عمومی طراحی شده است.',
    category: 'mental-health',
    keywords: ['تست اضطراب', 'GAD-7', 'اضطراب عمومی', 'تست روانشناسی', 'ارزیابی اضطراب'],
    ogImage: '/images/tests/anxiety-og.jpg',
    canonical: '/tests/anxiety',
    twitterCard: 'summary_large_image',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "PsychologicalTest",
      "name": "تست اضطراب GAD-7",
      "description": "تست اضطراب GAD-7 برای ارزیابی اضطراب عمومی",
      "url": "/tests/anxiety",
      "provider": {
        "@type": "Organization",
        "name": "تستولوژی"
      }
    }
  },
  'depression': {
    id: 'depression',
    slug: 'depression',
    title: 'تست افسردگی PHQ-9 | ارزیابی افسردگی',
    description: 'تست افسردگی PHQ-9 برای تشخیص و ارزیابی افسردگی استفاده می‌شود.',
    category: 'mental-health',
    keywords: ['تست افسردگی', 'PHQ-9', 'افسردگی', 'تست روانشناسی', 'ارزیابی افسردگی'],
    ogImage: '/images/tests/depression-og.jpg',
    canonical: '/tests/depression',
    twitterCard: 'summary_large_image',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "PsychologicalTest",
      "name": "تست افسردگی PHQ-9",
      "description": "تست افسردگی PHQ-9 برای ارزیابی افسردگی",
      "url": "/tests/depression",
      "provider": {
        "@type": "Organization",
        "name": "تستولوژی"
      }
    }
  },
  'life-satisfaction': {
    id: 'life-satisfaction',
    slug: 'life-satisfaction',
    title: 'تست رضایت از زندگی SWLS | ارزیابی رضایت از زندگی',
    description: 'تست رضایت از زندگی SWLS به شما کمک می‌کند تا میزان رضایت خود از زندگی را ارزیابی کنید.',
    category: 'wellbeing',
    keywords: ['تست رضایت از زندگی', 'SWLS', 'رضایت از زندگی', 'تست روانشناسی', 'ارزیابی رضایت'],
    ogImage: '/images/tests/life-satisfaction-og.jpg',
    canonical: '/tests/life-satisfaction',
    twitterCard: 'summary_large_image',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "PsychologicalTest",
      "name": "تست رضایت از زندگی SWLS",
      "description": "تست رضایت از زندگی SWLS برای ارزیابی رضایت از زندگی",
      "url": "/tests/life-satisfaction",
      "provider": {
        "@type": "Organization",
        "name": "تستولوژی"
      }
    }
  }
};

export function getTestMetadata(slug: string): TestMetadata | null {
  return testMetadata[slug] || null;
}

export function getAllTestSlugs(): string[] {
  return Object.keys(testMetadata);
}
















