'use client';

import { UISettingsProvider } from '@/components/UISettingsProvider';
import Navbar from '@/components/Navbar';
import NoSSR from '@/components/NoSSR';
import { SiteFooter } from '@/components/SiteFooter';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import SessionTimer from '@/components/auth/SessionTimer';
import ChatBotWidget from '@/components/ChatBotWidget';
import { useSession } from 'next-auth/react';
import GlobalErrorHandler from '@/components/GlobalErrorHandler';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <UISettingsProvider>
      <GlobalErrorHandler />
      <div className="relative flex min-h-screen flex-col">
        <NoSSR fallback={<div className="h-16 bg-gradient-to-l from-indigo-500/80 via-purple-500/80 to-pink-500/80"></div>}>
          <Navbar />
        </NoSSR>
        {/* <SessionTimer /> */}
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {/* چت‌بات مشاور */}
        {session?.user && (
          <ChatBotWidget user={session.user} />
        )}
      </div>
      <Analytics />
      <SpeedInsights />
    </UISettingsProvider>
  );
} 