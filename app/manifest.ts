import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Testology - تستولوژی',
    short_name: 'Testology',
    description: 'پلتفرم پیشرفته تست‌های روانشناختی آنلاین',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    orientation: 'portrait',
    scope: '/',
    lang: 'fa',
    dir: 'rtl',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon'
      }
    ],
    categories: ['health', 'medical', 'lifestyle'],
  }
}