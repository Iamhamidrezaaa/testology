// مدیریت redirects پیشرفته برای سئو
export interface RedirectRule {
  from: string;
  to: string;
  statusCode: 301 | 302 | 307 | 308;
  condition?: (request: Request) => boolean;
}

export const redirectRules: RedirectRule[] = [
  // Redirects برای تست‌های قدیمی
  {
    from: '/tests/rosenberg',
    to: '/tests/self-esteem',
    statusCode: 301
  },
  {
    from: '/tests/pss',
    to: '/tests/stress',
    statusCode: 301
  },
  {
    from: '/tests/gad7',
    to: '/tests/anxiety',
    statusCode: 301
  },
  {
    from: '/tests/phq9',
    to: '/tests/depression',
    statusCode: 301
  },
  {
    from: '/tests/swls',
    to: '/tests/life-satisfaction',
    statusCode: 301
  },
  
  // Redirects برای دسته‌بندی‌های قدیمی
  {
    from: '/category/personality',
    to: '/categories/personality',
    statusCode: 301
  },
  {
    from: '/category/mental-health',
    to: '/categories/mental-health',
    statusCode: 301
  },
  {
    from: '/category/wellbeing',
    to: '/categories/wellbeing',
    statusCode: 301
  },
  {
    from: '/category/anxiety',
    to: '/categories/anxiety',
    statusCode: 301
  },
  
  // Redirects برای شهرهای قدیمی
  {
    from: '/city/tehran',
    to: '/places/tehran',
    statusCode: 301
  },
  {
    from: '/city/mashhad',
    to: '/places/mashhad',
    statusCode: 301
  },
  {
    from: '/city/isfahan',
    to: '/places/isfahan',
    statusCode: 301
  },
  {
    from: '/city/shiraz',
    to: '/places/shiraz',
    statusCode: 301
  },
  {
    from: '/city/tabriz',
    to: '/places/tabriz',
    statusCode: 301
  },
  
  // Redirects برای صفحات قدیمی
  {
    from: '/test',
    to: '/tests',
    statusCode: 301
  },
  {
    from: '/category',
    to: '/categories',
    statusCode: 301
  },
  {
    from: '/city',
    to: '/places',
    statusCode: 301
  },
  
  // Redirects برای پارامترهای URL
  {
    from: '/tests/self-esteem?lang=fa',
    to: '/tests/self-esteem',
    statusCode: 301
  },
  {
    from: '/tests/self-esteem?utm_source=google',
    to: '/tests/self-esteem',
    statusCode: 301
  }
]

export function findRedirectRule(pathname: string, searchParams?: URLSearchParams): RedirectRule | null {
  // بررسی redirects دقیق
  for (const rule of redirectRules) {
    if (rule.from === pathname) {
      return rule
    }
  }
  
  // بررسی redirects با پارامترها
  if (searchParams) {
    const fullPath = `${pathname}?${searchParams.toString()}`
    for (const rule of redirectRules) {
      if (rule.from === fullPath) {
        return rule
      }
    }
  }
  
  // بررسی redirects با wildcard
  for (const rule of redirectRules) {
    if (rule.from.includes('*')) {
      const pattern = rule.from.replace(/\*/g, '.*')
      const regex = new RegExp(`^${pattern}$`)
      if (regex.test(pathname)) {
        return rule
      }
    }
  }
  
  return null
}

export function applyRedirect(rule: RedirectRule, baseUrl: string): Response {
  const redirectUrl = rule.to.startsWith('http') ? rule.to : `${baseUrl}${rule.to}`
  
  return new Response(null, {
    status: rule.statusCode,
    headers: {
      'Location': redirectUrl
    }
  })
}

export function generateRedirectsFile(): string {
  const redirects: string[] = []
  
  redirectRules.forEach(rule => {
    redirects.push(`${rule.from} ${rule.to} ${rule.statusCode}`)
  })
  
  return redirects.join('\n')
}

export function generateNginxRedirects(): string {
  const redirects: string[] = []
  
  redirectRules.forEach(rule => {
    redirects.push(`rewrite ^${rule.from}$ ${rule.to} permanent;`)
  })
  
  return redirects.join('\n')
}

export function generateApacheRedirects(): string {
  const redirects: string[] = []
  
  redirectRules.forEach(rule => {
    redirects.push(`Redirect ${rule.statusCode} ${rule.from} ${rule.to}`)
  })
  
  return redirects.join('\n')
}
















