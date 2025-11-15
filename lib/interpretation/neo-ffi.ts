/**
 * تفسیر تست NEO-FFI (شخصیت - پنج عامل بزرگ)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const NEO_FFI_INTERPRETATION: TestInterpretationConfig = {
  testId: "NEOFFI",
  byLevel: {
    low: (r) => ({
      id: "neo_ffi_low",
      title: "نمره پایین",
      body: "نمره پایین در این عامل شخصیت نشان می‌دهد که در این بُعد، الگوی رفتاری‌ات در محدوده پایین‌تر از میانگین قرار دارد. این به خودی‌خود نه خوب است و نه بد؛ فقط یک توصیف از الگوی فعلی‌ات است.",
      testId: "NEOFFI",
    }),
    medium: (r) => ({
      id: "neo_ffi_medium",
      title: "نمره متوسط",
      body: "نمره متوسط در این عامل شخصیت نشان می‌دهد که در این بُعد، الگوی رفتاری‌ات در محدوده میانگین قرار دارد. این یعنی در برخی موقعیت‌ها ممکن است این ویژگی را بیشتر نشان بدهی و در برخی کمتر.",
      testId: "NEOFFI",
    }),
    high: (r) => ({
      id: "neo_ffi_high",
      title: "نمره بالا",
      body: "نمره بالا در این عامل شخصیت نشان می‌دهد که این ویژگی در شخصیت تو پررنگ است. این می‌تواند هم نقطه قوت باشد و هم در برخی موقعیت‌ها چالش‌برانگیز.",
      testId: "NEOFFI",
    }),
  },
  // تفسیر بر اساس زیرمقیاس‌ها
  bySubscale: (result) => {
    const chunks = [];
    
    // Neuroticism
    const neuroticism = result.subscales.find(s => s.id === "neuroticism");
    if (neuroticism) {
      if (neuroticism.score <= 1.5) {
        chunks.push({
          id: "neo_neuroticism_low",
          title: "ثبات هیجانی",
          body: "نمره پایین در این عامل یعنی معمولاً در برابر فشارها و بالا‌پایین‌های روزمره، ثبات احساسی خوبی داری و کمتر دچار نوسان‌های شدید خلقی می‌شوی. این به این معنا نیست که استرس نمی‌گیری، فقط نشان می‌دهد سیستم هیجانی‌ات معمولاً زود از هم نمی‌پاشد.",
          testId: "NEOFFI",
        });
      } else if (neuroticism.score <= 2.5) {
        chunks.push({
          id: "neo_neuroticism_medium",
          title: "ثبات هیجانی",
          body: "نمره متوسط یعنی گاهی تحت فشار هیجانی قرار می‌گیری، اما معمولاً می‌توانی دوباره خودت را جمع کنی. در بعضی دوره‌ها ممکن است حساس‌تر و در دوره‌هایی مقاوم‌تر باشی.",
          testId: "NEOFFI",
        });
      } else {
        chunks.push({
          id: "neo_neuroticism_high",
          title: "ثبات هیجانی",
          body: "نمره بالا در این عامل یعنی هیجان‌ها را شدیدتر تجربه می‌کنی؛ نگرانی، دل‌شوره، غم یا خشم ممکن است زودتر فعال شوند و دیرتر فروکش کنند. این موضوع تقصیر تو نیست، بیشتر تنظیمات سیستم عصبی‌ات است؛ اما می‌توانی با یادگرفتن مهارت‌های تنظیم هیجان، از این حساسیت به‌عنوان یک توانایی (مثل همدلی و دقت) استفاده کنی.",
          testId: "NEOFFI",
        });
      }
    }

    // Extraversion
    const extraversion = result.subscales.find(s => s.id === "extraversion");
    if (extraversion) {
      if (extraversion.score <= 1.5) {
        chunks.push({
          id: "neo_extraversion_low",
          title: "برون‌گرایی",
          body: "نمره پایین یعنی بیشتر تمایل داری به فضاهای آرام، تنهایی یا گروه‌های کوچک و صمیمی. این به این معنی نیست که ضداجتماعی هستی؛ فقط انرژی‌ات از درون می‌آید نه از تعامل زیاد با دیگران.",
          testId: "NEOFFI",
        });
      } else if (extraversion.score <= 2.5) {
        chunks.push({
          id: "neo_extraversion_medium",
          title: "برون‌گرایی",
          body: "نمره متوسط یعنی هم می‌توانی از تنهایی انرژی بگیری، هم از بودن در جمع. بسته به موقعیت و انرژی‌ات، بین این دو حالت جابه‌جا می‌شوی.",
          testId: "NEOFFI",
        });
      } else {
        chunks.push({
          id: "neo_extraversion_high",
          title: "برون‌گرایی",
          body: "نمره بالا یعنی معمولاً از تعامل با دیگران، بودن در جمع و فعالیت‌های اجتماعی انرژی می‌گیری. تنهایی طولانی ممکن است برایت خسته‌کننده باشد.",
          testId: "NEOFFI",
        });
      }
    }

    // Openness
    const openness = result.subscales.find(s => s.id === "openness");
    if (openness) {
      if (openness.score <= 1.5) {
        chunks.push({
          id: "neo_openness_low",
          title: "گشودگی",
          body: "نمره پایین یعنی بیشتر تمایل داری به روش‌های امتحان‌شده، قابل‌پیش‌بینی و سنتی. این به این معنی نیست که غیرخلاق هستی؛ فقط ترجیح می‌دهی در چارچوب‌های مشخص کار کنی.",
          testId: "NEOFFI",
        });
      } else if (openness.score <= 2.5) {
        chunks.push({
          id: "neo_openness_medium",
          title: "گشودگی",
          body: "نمره متوسط یعنی هم می‌توانی از چیزهای جدید لذت ببری، هم از روتین‌های آشنا. بسته به موقعیت، بین این دو حالت جابه‌جا می‌شوی.",
          testId: "NEOFFI",
        });
      } else {
        chunks.push({
          id: "neo_openness_high",
          title: "گشودگی",
          body: "نمره بالا یعنی معمولاً به تجربه‌های جدید، ایده‌های غیرمعمول و تغییر علاقه داری. ممکن است از روتین‌های تکراری زود خسته شوی.",
          testId: "NEOFFI",
        });
      }
    }

    // Agreeableness
    const agreeableness = result.subscales.find(s => s.id === "agreeableness");
    if (agreeableness) {
      if (agreeableness.score <= 1.5) {
        chunks.push({
          id: "neo_agreeableness_low",
          title: "توافق‌پذیری",
          body: "نمره پایین یعنی بیشتر تمایل داری صریح و مستقیم باشی، حتی اگر گاهی باعث ناراحتی دیگران شود. این به این معنی نیست که بی‌رحم هستی؛ فقط ترجیح می‌دهی حقیقت را بگویی.",
          testId: "NEOFFI",
        });
      } else if (agreeableness.score <= 2.5) {
        chunks.push({
          id: "neo_agreeableness_medium",
          title: "توافق‌پذیری",
          body: "نمره متوسط یعنی هم می‌توانی همکاری‌جو باشی، هم در مواقع لازم صریح و قاطع. بسته به موقعیت، بین این دو حالت جابه‌جا می‌شوی.",
          testId: "NEOFFI",
        });
      } else {
        chunks.push({
          id: "neo_agreeableness_high",
          title: "توافق‌پذیری",
          body: "نمره بالا یعنی معمولاً تمایل داری با دیگران همکاری کنی، از تعارض اجتناب کنی و روابط را حفظ کنی. ممکن است گاهی به خاطر حفظ صلح، نیازهای خودت را نادیده بگیری.",
          testId: "NEOFFI",
        });
      }
    }

    // Conscientiousness
    const conscientiousness = result.subscales.find(s => s.id === "conscientiousness");
    if (conscientiousness) {
      if (conscientiousness.score <= 1.5) {
        chunks.push({
          id: "neo_conscientiousness_low",
          title: "وظیفه‌شناسی",
          body: "نمره پایین یعنی بیشتر تمایل داری خودبه‌جوش و منعطف باشی تا ساختارمند و برنامه‌ریزی‌شده. این به این معنی نیست که بی‌مسئولیت هستی؛ فقط ترجیح می‌دهی آزادانه‌تر عمل کنی.",
          testId: "NEOFFI",
        });
      } else if (conscientiousness.score <= 2.5) {
        chunks.push({
          id: "neo_conscientiousness_medium",
          title: "وظیفه‌شناسی",
          body: "نمره متوسط یعنی هم می‌توانی منظم و برنامه‌ریزی‌شده باشی، هم گاهی خودبه‌جوش و منعطف. بسته به موقعیت، بین این دو حالت جابه‌جا می‌شوی.",
          testId: "NEOFFI",
        });
      } else {
        chunks.push({
          id: "neo_conscientiousness_high",
          title: "وظیفه‌شناسی",
          body: "نمره بالا یعنی معمولاً هدف‌گرا، منظم و ساختارمند هستی. برنامه‌ریزی و پیگیری برایت مهم است. ممکن است گاهی بیش‌ازحد سخت‌گیر باشی.",
          testId: "NEOFFI",
        });
      }
    }

    return chunks;
  },
};

