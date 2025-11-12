import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { SessionWrapper } from './session-wrapper';
import { ThemeProvider } from '@/components/theme-provider';
import { ClientLayout } from '@/components/ClientLayout';
import { Toaster } from 'react-hot-toast';
import { HotToaster } from '@/components/ui/sonner';
import LoginModalWrapper from '@/components/LoginModalWrapper';
import SupportChatWidget from '@/components/SupportWidget';

const inter = Inter({ subsets: ['latin'] });
const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazir',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://testology.me'),
  title: 'Testology - پلتفرم هوشمند روان‌شناسی',
  description: 'تست‌های روان‌شناسی علمی + تحلیل AI + مشاوره آنلاین',
  keywords: 'تست روان‌شناسی، مشاوره آنلاین، افسردگی، اضطراب، استرس',
  authors: [{ name: 'Testology Team' }],
  openGraph: {
    title: 'Testology - پلتفرم هوشمند روان‌شناسی',
    description: 'تست‌های روان‌شناسی علمی + تحلیل AI + مشاوره آنلاین',
    type: 'website',
    locale: 'fa_IR',
    siteName: 'Testology'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testology - پلتفرم هوشمند روان‌شناسی',
    description: 'تست‌های روان‌شناسی علمی + تحلیل AI + مشاوره آنلاین'
  },
  robots: 'index, follow',
  other: {
    'X-UA-Compatible': 'IE=edge',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} font-sans ${inter.className}`}>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/vazir.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//api.openai.com" />
        
        {/* Critical CSS inline */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              font-family: 'Vazirmatn', var(--font-vazir), system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans Arabic', 'IRANSans', Arial, sans-serif !important; 
              margin: 0; 
              padding: 0; 
            }
            * {
              font-family: 'Vazirmatn', var(--font-vazir), system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans Arabic', 'IRANSans', Arial, sans-serif !important;
            }
            .loading { opacity: 0; transition: opacity 0.3s ease; }
            .loaded { opacity: 1; }
          `
        }} />
        
        {/* Global Error Handler Script - اجرا قبل از React */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // لیست خطاهای غیرضروری که باید نادیده گرفته شوند
                const ignoredErrors = [
                  'MetaMask',
                  'metamask',
                  'Failed to connect to MetaMask',
                  'chrome-extension://',
                  'moz-extension://',
                  'safari-extension://',
                  'extension://',
                  'Non-Error promise rejection',
                  'ResizeObserver loop',
                  'ResizeObserver loop limit exceeded',
                ];

                // بررسی اینکه آیا خطا باید نادیده گرفته شود
                function shouldIgnoreError(error) {
                  if (!error) return false;
                  const errorMessage = (error.message || error.toString() || '').toLowerCase();
                  const errorStack = (error.stack || '').toLowerCase();
                  const fullError = errorMessage + ' ' + errorStack;

                  return ignoredErrors.some(ignored => 
                    fullError.includes(ignored.toLowerCase())
                  );
                }

                // Handler برای خطاهای unhandled
                window.addEventListener('error', function(event) {
                  if (shouldIgnoreError(event.error || event.message)) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  }
                }, true);

                // Handler برای unhandled promise rejections
                window.addEventListener('unhandledrejection', function(event) {
                  const reason = event.reason;
                  if (shouldIgnoreError(reason)) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 font-vazir">
        <SessionWrapper>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ClientLayout>{children}</ClientLayout>
              <Toaster />
              <HotToaster />
              <LoginModalWrapper />
              <SupportChatWidget />
            </ThemeProvider>
          </Providers>
        </SessionWrapper>
      </body>
    </html>
  );
}