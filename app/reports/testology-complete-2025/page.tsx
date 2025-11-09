import { readFileSync } from 'fs';
import { join } from 'path';
import { Metadata } from 'next';

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
    const bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;
    
    // استخراج محتوای style
    const styleMatch = htmlContent.match(/<style[^>]*>([\s\S]*)<\/style>/i);
    const styleContent = styleMatch ? styleMatch[1] : '';
    
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: styleContent }} />
        <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
      </>
    );
  } catch (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>خطا در بارگذاری گزارش</h1>
        <p>فایل گزارش یافت نشد.</p>
      </div>
    );
  }
}

