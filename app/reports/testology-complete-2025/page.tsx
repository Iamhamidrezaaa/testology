import { readFileSync } from 'fs';
import { join } from 'path';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const VideoPlayerWrapper = dynamic(() => import('./VideoPlayerWrapper'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'گزارش کامل پروژه Testology 2025',
  description: 'گزارش کامل پروژه Testology 2025 - پلتفرم هوشمند روان‌شناسی',
};

export default function TestologyCompleteReport2025Page() {
  // خواندن فایل HTML از روت پروژه
  const htmlPath = join(process.cwd(), 'TESTOLOGY_COMPLETE_REPORT_2025.html');
  let htmlContent = '';
  
  try {
    htmlContent = readFileSync(htmlPath, 'utf-8');
    // استخراج محتوای body
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    let bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;
    
    // استخراج محتوای style
    const styleMatch = htmlContent.match(/<style[^>]*>([\s\S]*)<\/style>/i);
    const styleContent = styleMatch ? styleMatch[1] : '';
    
    // پیدا کردن محل قرارگیری ویدئو (بعد از cover و قبل از toc)
    const coverEndIndex = bodyContent.indexOf('</div>', bodyContent.indexOf('<div class="cover">'));
    const tocStartIndex = bodyContent.indexOf('<div class="toc">');
    
    if (coverEndIndex !== -1 && tocStartIndex !== -1) {
      const beforeToc = bodyContent.substring(0, tocStartIndex);
      const afterToc = bodyContent.substring(tocStartIndex);
      
      // اضافه کردن placeholder برای ویدئو پلیر
      const videoPlaceholder = `
        <section id="introduction" style="margin: 40px 0;">
          <div id="video-player-placeholder"></div>
        </section>
      `;
      
      bodyContent = beforeToc + videoPlaceholder + afterToc;
    }
    
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: styleContent }} />
        <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
        <VideoPlayerWrapper />
      </>
    );
  } catch (error) {
    console.error('Error loading report:', error);
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>خطا در بارگذاری گزارش</h1>
        <p>فایل گزارش یافت نشد.</p>
        <p style={{ color: 'red', marginTop: '20px' }}>Error: {error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
}

