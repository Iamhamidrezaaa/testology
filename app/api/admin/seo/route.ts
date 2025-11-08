import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getOpenAI } from '@/lib/openai';

const LANGS = ['en', 'fa', 'ar', 'fr', 'ru', 'tr', 'es'];

// پرامپت‌های مخصوص هر زبان برای SEO
const SEO_PROMPTS = {
  en: `You are a professional SEO expert specializing in psychology and mental health content.
Generate optimized meta tags for search engines.
Focus on: clear titles, compelling descriptions, relevant keywords.
Keep titles under 60 characters, descriptions under 160 characters.
Return JSON format only.`,
  
  fa: `شما یک متخصص SEO حرفه‌ای در زمینه روان‌شناسی و سلامت روان هستید.
تگ‌های متای بهینه برای موتورهای جست‌وجو تولید کنید.
تمرکز بر: عناوین واضح، توضیحات جذاب، کلمات کلیدی مرتبط.
عناوین زیر 60 کاراکتر، توضیحات زیر 160 کاراکتر.
فقط فرمت JSON برگردانید.`,
  
  ar: `أنت خبير SEO محترف متخصص في المحتوى النفسي والصحة العقلية.
أنشئ علامات ميتا محسّنة لمحركات البحث.
ركز على: عناوين واضحة، أوصاف مقنعة، كلمات مفتاحية ذات صلة.
العناوين أقل من 60 حرف، الأوصاف أقل من 160 حرف.
أرجع تنسيق JSON فقط.`,
  
  fr: `Vous êtes un expert SEO professionnel spécialisé dans le contenu psychologique et la santé mentale.
Générez des balises meta optimisées pour les moteurs de recherche.
Concentrez-vous sur: titres clairs, descriptions convaincantes, mots-clés pertinents.
Titres sous 60 caractères, descriptions sous 160 caractères.
Retournez uniquement le format JSON.`,
  
  ru: `Вы профессиональный SEO-эксперт, специализирующийся на психологическом контенте и психическом здоровье.
Создавайте оптимизированные мета-теги для поисковых систем.
Сосредоточьтесь на: четких заголовках, убедительных описаниях, релевантных ключевых словах.
Заголовки до 60 символов, описания до 160 символов.
Возвращайте только формат JSON.`,
  
  tr: `Psikoloji ve ruh sağlığı içeriği konusunda uzman profesyonel bir SEO uzmanısınız.
Arama motorları için optimize edilmiş meta etiketleri oluşturun.
Odaklanın: net başlıklar, ikna edici açıklamalar, ilgili anahtar kelimeler.
Başlıklar 60 karakter altında, açıklamalar 160 karakter altında.
Sadece JSON formatını döndürün.`,
  
  es: `Eres un experto SEO profesional especializado en contenido psicológico y salud mental.
Genera etiquetas meta optimizadas para motores de búsqueda.
Enfócate en: títulos claros, descripciones convincentes, palabras clave relevantes.
Títulos bajo 60 caracteres, descripciones bajo 160 caracteres.
Devuelve solo formato JSON.`
};

/**
 * تولید خودکار متای SEO برای تمام زبان‌ها
 * POST /api/admin/seo
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // بررسی دسترسی ادمین
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id, type, title, content, description } = await req.json();

    if (!id || !type || !title || !content) {
      return NextResponse.json({ 
        error: 'Missing required fields: id, type, title, content' 
      }, { status: 400 });
    }

    if (!['article', 'test', 'exercise'].includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid type. Must be: article, test, or exercise' 
      }, { status: 400 });
    }

    const seoData: Record<string, any> = {};
    const results: Record<string, any> = {};

    // تولید SEO برای هر زبان
    for (const lang of LANGS) {
      try {
        const prompt = SEO_PROMPTS[lang as keyof typeof SEO_PROMPTS];
        
        const fullPrompt = `${prompt}

Content Type: ${type}
Original Title: ${title}
${description ? `Description: ${description}` : ''}

Content:
${content.substring(0, 1000)}

Generate SEO meta for this ${type} in ${lang}.
Return JSON with:
{
  "title": "<SEO Title in ${lang}>",
  "description": "<Meta Description in ${lang}>",
  "keywords": "<comma-separated keywords in ${lang}>",
  "ogTitle": "<Open Graph Title in ${lang}>",
  "ogDescription": "<Open Graph Description in ${lang}>"
}`;

        const openai = getOpenAI();
        if (!openai) {
          // Fallback if OpenAI API key is not available
          results[lang] = {
            title: title,
            description: description || content.substring(0, 160),
            keywords: '',
            ogTitle: title,
            ogDescription: description || content.substring(0, 160)
          };
          continue;
        }

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: fullPrompt }
          ],
          temperature: 0.3,
          max_tokens: 500
        });

        const rawContent = response.choices[0]?.message?.content?.trim() || '{}';
        
        // تمیز کردن JSON
        const cleanContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        
        let parsed;
        try {
          parsed = JSON.parse(cleanContent);
        } catch (parseError) {
          console.error(`JSON parse error for ${lang}:`, parseError);
          parsed = {
            title: title,
            description: description || content.substring(0, 160),
            keywords: '',
            ogTitle: title,
            ogDescription: description || content.substring(0, 160)
          };
        }

        // اعتبارسنجی و تمیز کردن داده‌ها
        const seoMeta = {
          title: parsed.title?.substring(0, 60) || title,
          description: parsed.description?.substring(0, 160) || description || content.substring(0, 160),
          keywords: parsed.keywords || '',
          ogTitle: parsed.ogTitle?.substring(0, 60) || parsed.title?.substring(0, 60) || title,
          ogDescription: parsed.ogDescription?.substring(0, 160) || parsed.description?.substring(0, 160) || description || content.substring(0, 160)
        };

        // ذخیره در دیتابیس
        const savedMeta = await prisma.seoMeta.upsert({
          where: { 
            key_lang: { 
              key: `${type}_${id}`, 
              lang: lang 
            } 
          },
          update: {
            title: seoMeta.title,
            description: seoMeta.description,
            keywords: seoMeta.keywords,
            ogTitle: seoMeta.ogTitle,
            ogDescription: seoMeta.ogDescription,
            updatedAt: new Date()
          },
          create: {
            key: `${type}_${id}`,
            lang: lang,
            title: seoMeta.title,
            description: seoMeta.description,
            keywords: seoMeta.keywords,
            ogTitle: seoMeta.ogTitle,
            ogDescription: seoMeta.ogDescription
          }
        });

        seoData[lang] = seoMeta;
        results[lang] = {
          success: true,
          metaId: savedMeta.id,
          title: seoMeta.title,
          description: seoMeta.description.substring(0, 50) + '...'
        };

      } catch (error) {
        console.error(`SEO generation error for ${lang}:`, error);
        results[lang] = {
          success: false,
          error: error instanceof Error ? error.message : 'SEO generation failed'
        };
      }
    }

    // آمار موفقیت
    const successCount = Object.values(results).filter((r: any) => r.success).length;
    const totalCount = LANGS.length;

    return NextResponse.json({
      success: true,
      message: `Generated SEO meta for ${successCount}/${totalCount} languages`,
      seoData,
      results,
      stats: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount
      }
    });

  } catch (error) {
    console.error('SEO API error:', error);
    return NextResponse.json(
      { error: 'SEO generation failed' },
      { status: 500 }
    );
  }
}

/**
 * دریافت متای SEO موجود
 * GET /api/admin/seo?type=article&id=123
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ 
        error: 'Missing required parameters: type, id' 
      }, { status: 400 });
    }

    const seoMetas = await prisma.seoMeta.findMany({
      where: {
        key: `${type}_${id}`
      },
      orderBy: { lang: 'asc' }
    });

    return NextResponse.json({
      success: true,
      seoMetas
    });

  } catch (error) {
    console.error('Get SEO meta error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO meta' },
      { status: 500 }
    );
  }
}
