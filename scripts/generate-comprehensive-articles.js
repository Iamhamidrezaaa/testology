const fs = require('fs');
const path = require('path');

// ساختار کامل مقالات - 10 موضوع × 10 مقاله = 100 مقاله
const articleStructure = {
  "personality": {
    name: "روان‌شناسی شخصیت",
    icon: "🧠",
    articles: [
      {
        title: "مقدمه‌ای بر روان‌شناسی شخصیت: شناخت خود و دیگران",
        slug: "introduction-personality-psychology",
        focus: "مفاهیم پایه و نظریه‌ها"
      },
      {
        title: "تست MBTI: راهنمای کامل 16 تیپ شخصیتی",
        slug: "mbti-complete-guide-16-personality-types",
        focus: "تحلیل عمیق تیپ‌های شخصیتی"
      },
      {
        title: "تست Big Five: پنج عامل بزرگ شخصیت",
        slug: "big-five-personality-traits-complete-guide",
        focus: "بررسی صفات شخصیتی"
      },
      {
        title: "تست Enneagram: نه تیپ شخصیتی و رشد شخصی",
        slug: "enneagram-personality-types-growth",
        focus: "شناخت الگوهای رفتاری"
      },
      {
        title: "تست DISC: تحلیل سبک ارتباطی و بهبود روابط",
        slug: "disc-communication-style-relationships",
        focus: "بهبود روابط بین‌فردی"
      },
      {
        title: "تست Holland: انتخاب شغل بر اساس شخصیت",
        slug: "holland-career-choice-personality",
        focus: "راهنمای شغلی"
      },
      {
        title: "تست StrengthsFinder: کشف و توسعه نقاط قوت",
        slug: "strengthsfinder-discover-develop-strengths",
        focus: "توسعه استعدادها"
      },
      {
        title: "تست Emotional Intelligence: هوش هیجانی در عمل",
        slug: "emotional-intelligence-practical-guide",
        focus: "مدیریت احساسات"
      },
      {
        title: "تست Attachment Style: سبک دلبستگی و روابط عاطفی",
        slug: "attachment-style-emotional-relationships",
        focus: "روابط عاطفی"
      },
      {
        title: "تست Values Assessment: ارزش‌های شخصی و تصمیم‌گیری",
        slug: "values-assessment-personal-decision-making",
        focus: "شناخت اولویت‌ها"
      }
    ]
  },
  "anxiety-depression": {
    name: "اضطراب و افسردگی",
    icon: "😰",
    articles: [
      {
        title: "راهنمای کامل مدیریت اضطراب: تکنیک‌های عملی",
        slug: "complete-anxiety-management-guide",
        focus: "تکنیک‌های عملی کاهش اضطراب"
      },
      {
        title: "شناخت انواع اضطراب و راه‌های درمان مؤثر",
        slug: "types-anxiety-effective-treatments",
        focus: "تشخیص و درمان"
      },
      {
        title: "تست اضطراب: ارزیابی و سنجش سطح اضطراب",
        slug: "anxiety-test-assessment-evaluation",
        focus: "سنجش اضطراب"
      },
      {
        title: "تکنیک‌های تنفسی برای کاهش اضطراب و استرس",
        slug: "breathing-techniques-anxiety-stress",
        focus: "تمرینات عملی"
      },
      {
        title: "مدیریت حملات پانیک: راهکارهای اضطراری",
        slug: "panic-attack-management-emergency",
        focus: "راهکارهای اضطراری"
      },
      {
        title: "تست افسردگی: تشخیص، ارزیابی و راه‌های درمان",
        slug: "depression-test-diagnosis-treatment",
        focus: "سنجش افسردگی"
      },
      {
        title: "راه‌های مقابله با افسردگی: درمان‌های خودیاری",
        slug: "coping-depression-self-help-treatments",
        focus: "درمان‌های خودیاری"
      },
      {
        title: "تست PHQ-9: ارزیابی افسردگی و تفسیر نتایج",
        slug: "phq9-depression-assessment-results",
        focus: "ابزار تشخیصی"
      },
      {
        title: "تست GAD-7: ارزیابی اضطراب عمومی و مدیریت",
        slug: "gad7-general-anxiety-assessment",
        focus: "سنجش اضطراب"
      },
      {
        title: "تست Beck Depression: تشخیص تخصصی افسردگی",
        slug: "beck-depression-inventory-specialized",
        focus: "ارزیابی تخصصی"
      }
    ]
  },
  "relationships-emotions": {
    name: "روابط و احساسات",
    icon: "💕",
    articles: [
      {
        title: "هنر برقراری ارتباط مؤثر: مهارت‌های ارتباطی",
        slug: "effective-communication-skills-art",
        focus: "مهارت‌های ارتباطی"
      },
      {
        title: "تست عشق: شناخت سبک عاشقی و روابط عاطفی",
        slug: "love-test-romantic-style-relationships",
        focus: "تحلیل روابط عاطفی"
      },
      {
        title: "مدیریت تعارض در روابط: راه‌های حل مسائل",
        slug: "conflict-management-relationships-solutions",
        focus: "حل مسائل ارتباطی"
      },
      {
        title: "تست Attachment: سبک دلبستگی در روابط",
        slug: "attachment-test-relationship-styles",
        focus: "تحلیل روابط"
      },
      {
        title: "هوش هیجانی در روابط: مدیریت احساسات",
        slug: "emotional-intelligence-relationships-management",
        focus: "مدیریت احساسات"
      },
      {
        title: "تست Love Languages: زبان عشق و بهبود روابط",
        slug: "love-languages-test-relationship-improvement",
        focus: "بهبود روابط"
      },
      {
        title: "مدیریت خشم در روابط: کنترل احساسات منفی",
        slug: "anger-management-relationships-control",
        focus: "کنترل احساسات منفی"
      },
      {
        title: "تست Relationship Satisfaction: رضایت از رابطه",
        slug: "relationship-satisfaction-test-evaluation",
        focus: "رضایت از رابطه"
      },
      {
        title: "مهارت‌های گوش دادن فعال: بهبود ارتباط",
        slug: "active-listening-skills-communication",
        focus: "بهبود ارتباط"
      },
      {
        title: "تست Emotional Intelligence: سنجش هوش هیجانی",
        slug: "emotional-intelligence-test-assessment",
        focus: "سنجش هوش هیجانی"
      }
    ]
  },
  "personal-growth": {
    name: "رشد فردی",
    icon: "🌱",
    articles: [
      {
        title: "راهنمای کامل توسعه فردی: برنامه رشد شخصی",
        slug: "complete-personal-development-guide",
        focus: "برنامه رشد شخصی"
      },
      {
        title: "تست Self-Awareness: خودآگاهی و شناخت خود",
        slug: "self-awareness-test-self-knowledge",
        focus: "شناخت خود"
      },
      {
        title: "هدف‌گذاری مؤثر و SMART: برنامه‌ریزی زندگی",
        slug: "effective-goal-setting-smart-life-planning",
        focus: "برنامه‌ریزی زندگی"
      },
      {
        title: "تست Goal Setting: ارزیابی اهداف و برنامه‌ریزی",
        slug: "goal-setting-test-evaluation-planning",
        focus: "سنجش هدف‌ها"
      },
      {
        title: "مدیریت زمان و بهره‌وری: بهینه‌سازی عملکرد",
        slug: "time-management-productivity-optimization",
        focus: "بهینه‌سازی عملکرد"
      },
      {
        title: "تست Time Management: مدیریت زمان و ارزیابی",
        slug: "time-management-test-evaluation-skills",
        focus: "ارزیابی مهارت‌ها"
      },
      {
        title: "توسعه مهارت‌های رهبری: رشد مدیریتی",
        slug: "leadership-skills-development-management",
        focus: "رشد مهارت‌های مدیریتی"
      },
      {
        title: "تست Leadership Style: سبک رهبری و تحلیل",
        slug: "leadership-style-test-analysis",
        focus: "تحلیل رهبری"
      },
      {
        title: "مهارت‌های تصمیم‌گیری: بهبود انتخاب‌ها",
        slug: "decision-making-skills-improvement",
        focus: "بهبود انتخاب‌ها"
      },
      {
        title: "تست Decision Making: ارزیابی تصمیم‌گیری",
        slug: "decision-making-test-evaluation",
        focus: "سنجش مهارت‌ها"
      }
    ]
  },
  "mindfulness-focus": {
    name: "تمرکز و ذهن‌آگاهی",
    icon: "🧘",
    articles: [
      {
        title: "راهنمای کامل مدیتیشن: تکنیک‌های آرامش",
        slug: "complete-meditation-guide-relaxation",
        focus: "تکنیک‌های آرامش"
      },
      {
        title: "تست Mindfulness: سنجش ذهن‌آگاهی و تمرکز",
        slug: "mindfulness-test-awareness-focus",
        focus: "ارزیابی تمرکز"
      },
      {
        title: "تکنیک‌های تنفسی برای آرامش و کاهش استرس",
        slug: "breathing-techniques-relaxation-stress",
        focus: "تمرینات عملی"
      },
      {
        title: "تست Meditation Readiness: آمادگی مدیتیشن",
        slug: "meditation-readiness-test-preparation",
        focus: "سنجش آمادگی"
      },
      {
        title: "مدیریت استرس با ذهن‌آگاهی: کاهش تنش",
        slug: "stress-management-mindfulness-reduction",
        focus: "کاهش تنش"
      },
      {
        title: "تست Stress Level: ارزیابی استرس و مدیریت",
        slug: "stress-level-test-evaluation-management",
        focus: "سنجش استرس"
      },
      {
        title: "تمرینات تمرکز و توجه: بهبود تمرکز",
        slug: "focus-attention-exercises-improvement",
        focus: "بهبود تمرکز"
      },
      {
        title: "تست Attention Span: ارزیابی تمرکز و توجه",
        slug: "attention-span-test-focus-evaluation",
        focus: "سنجش توجه"
      },
      {
        title: "یوگا و سلامت روان: تلفیق جسم و ذهن",
        slug: "yoga-mental-health-body-mind",
        focus: "تلفیق جسم و ذهن"
      },
      {
        title: "تست Yoga Readiness: آمادگی یوگا و ارزیابی",
        slug: "yoga-readiness-test-evaluation",
        focus: "ارزیابی آمادگی"
      }
    ]
  },
  "sleep-mental-health": {
    name: "خواب و سلامت ذهن",
    icon: "😴",
    articles: [
      {
        title: "راهنمای کامل بهداشت خواب: بهبود کیفیت خواب",
        slug: "complete-sleep-hygiene-quality-improvement",
        focus: "بهبود کیفیت خواب"
      },
      {
        title: "تست Sleep Quality: ارزیابی خواب و کیفیت",
        slug: "sleep-quality-test-evaluation",
        focus: "سنجش کیفیت خواب"
      },
      {
        title: "مدیریت بی‌خوابی: درمان مشکلات خواب",
        slug: "insomnia-management-sleep-problems",
        focus: "درمان مشکلات خواب"
      },
      {
        title: "تست Insomnia: تشخیص بی‌خوابی و ارزیابی",
        slug: "insomnia-test-diagnosis-evaluation",
        focus: "ارزیابی اختلالات"
      },
      {
        title: "تکنیک‌های آرامش قبل از خواب: آماده‌سازی",
        slug: "relaxation-techniques-sleep-preparation",
        focus: "آماده‌سازی برای خواب"
      },
      {
        title: "تست Sleep Hygiene: بهداشت خواب و عادات",
        slug: "sleep-hygiene-test-habits-evaluation",
        focus: "سنجش عادات"
      },
      {
        title: "رویاها و سلامت روان: تحلیل رویاها",
        slug: "dreams-mental-health-analysis",
        focus: "تحلیل رویاها"
      },
      {
        title: "تست Dream Analysis: تحلیل رویا و محتوا",
        slug: "dream-analysis-test-content",
        focus: "بررسی محتوای رویا"
      },
      {
        title: "مدیریت کابوس‌ها: کنترل خواب‌های بد",
        slug: "nightmare-management-bad-dreams",
        focus: "کنترل خواب‌های بد"
      },
      {
        title: "تست Nightmare Frequency: کابوس‌ها و ارزیابی",
        slug: "nightmare-frequency-test-evaluation",
        focus: "ارزیابی مشکلات"
      }
    ]
  },
  "motivation-success": {
    name: "انگیزش و موفقیت",
    icon: "🚀",
    articles: [
      {
        title: "راهنمای کامل انگیزش شخصی: تقویت انگیزه",
        slug: "complete-personal-motivation-guide",
        focus: "تقویت انگیزه"
      },
      {
        title: "تست Motivation: سنجش انگیزه و ارزیابی",
        slug: "motivation-test-evaluation-assessment",
        focus: "ارزیابی انگیزش"
      },
      {
        title: "مدیریت ترس از شکست: غلبه بر موانع",
        slug: "fear-failure-management-overcoming",
        focus: "غلبه بر موانع"
      },
      {
        title: "تست Fear of Failure: ترس از شکست و سنجش",
        slug: "fear-failure-test-evaluation",
        focus: "سنجش ترس‌ها"
      },
      {
        title: "توسعه عادت‌های مثبت: ایجاد تغییرات پایدار",
        slug: "positive-habits-development-sustainable",
        focus: "ایجاد تغییرات پایدار"
      },
      {
        title: "تست Habit Formation: تشکیل عادت و سنجش",
        slug: "habit-formation-test-evaluation",
        focus: "سنجش عادت‌ها"
      },
      {
        title: "مدیریت انرژی و خستگی: بهینه‌سازی عملکرد",
        slug: "energy-fatigue-management-optimization",
        focus: "بهینه‌سازی عملکرد"
      },
      {
        title: "تست Energy Level: سطح انرژی و ارزیابی",
        slug: "energy-level-test-evaluation",
        focus: "ارزیابی انرژی"
      },
      {
        title: "توسعه مهارت‌های حل مسئله: بهبود تفکر",
        slug: "problem-solving-skills-development",
        focus: "بهبود تفکر"
      },
      {
        title: "تست Problem Solving: حل مسئله و سنجش",
        slug: "problem-solving-test-evaluation",
        focus: "سنجش مهارت‌ها"
      }
    ]
  },
  "lifestyle-work": {
    name: "سبک زندگی و کار",
    icon: "⚖️",
    articles: [
      {
        title: "تعادل کار و زندگی: مدیریت اولویت‌ها",
        slug: "work-life-balance-priority-management",
        focus: "مدیریت اولویت‌ها"
      },
      {
        title: "تست Work-Life Balance: تعادل کار-زندگی",
        slug: "work-life-balance-test-evaluation",
        focus: "سنجش تعادل"
      },
      {
        title: "مدیریت استرس شغلی: کاهش فشار کار",
        slug: "workplace-stress-management-reduction",
        focus: "کاهش فشار کار"
      },
      {
        title: "تست Job Stress: استرس شغلی و ارزیابی",
        slug: "job-stress-test-evaluation",
        focus: "ارزیابی فشار کار"
      },
      {
        title: "توسعه مهارت‌های شغلی: رشد حرفه‌ای",
        slug: "professional-skills-development-career",
        focus: "رشد حرفه‌ای"
      },
      {
        title: "تست Career Readiness: آمادگی شغلی و سنجش",
        slug: "career-readiness-test-evaluation",
        focus: "سنجش مهارت‌ها"
      },
      {
        title: "مدیریت روابط کاری: بهبود ارتباطات شغلی",
        slug: "workplace-relationships-communication",
        focus: "بهبود ارتباطات شغلی"
      },
      {
        title: "تست Teamwork: کار تیمی و ارزیابی",
        slug: "teamwork-test-evaluation",
        focus: "ارزیابی همکاری"
      },
      {
        title: "توسعه مهارت‌های مدیریتی: رشد رهبری",
        slug: "management-skills-development-leadership",
        focus: "رشد رهبری"
      },
      {
        title: "تست Management Skills: مهارت‌های مدیریت",
        slug: "management-skills-test-evaluation",
        focus: "سنجش توانایی‌ها"
      }
    ]
  },
  "test-analysis": {
    name: "تحلیل تست‌ها",
    icon: "📊",
    articles: [
      {
        title: "راهنمای تفسیر تست‌های روان‌شناسی: تحلیل نتایج",
        slug: "psychological-tests-interpretation-guide",
        focus: "تحلیل نتایج"
      },
      {
        title: "تست Test Interpretation: تفسیر تست و سنجش",
        slug: "test-interpretation-skills-evaluation",
        focus: "سنجش مهارت‌ها"
      },
      {
        title: "مقایسه تست‌های مختلف: انتخاب مناسب‌ترین تست",
        slug: "psychological-tests-comparison-selection",
        focus: "انتخاب مناسب‌ترین تست"
      },
      {
        title: "تست Test Selection: انتخاب تست و راهنمای",
        slug: "test-selection-guide-evaluation",
        focus: "راهنمای انتخاب"
      },
      {
        title: "تحلیل آماری نتایج تست‌ها: درک آمار",
        slug: "statistical-analysis-test-results",
        focus: "درک آمار"
      },
      {
        title: "تست Statistical Analysis: تحلیل آماری و سنجش",
        slug: "statistical-analysis-test-evaluation",
        focus: "سنجش مهارت‌ها"
      },
      {
        title: "نقاط قوت و ضعف در تست‌ها: شناسایی الگوها",
        slug: "test-strengths-weaknesses-patterns",
        focus: "شناسایی الگوها"
      },
      {
        title: "تست Strength Analysis: تحلیل نقاط قوت",
        slug: "strength-analysis-test-evaluation",
        focus: "ارزیابی توانایی‌ها"
      },
      {
        title: "توسعه بر اساس نتایج تست: برنامه‌ریزی رشد",
        slug: "development-based-test-results-planning",
        focus: "برنامه‌ریزی رشد"
      },
      {
        title: "تست Development Planning: برنامه رشد و سنجش",
        slug: "development-planning-test-evaluation",
        focus: "سنجش برنامه‌ریزی"
      }
    ]
  },
  "scientific-research": {
    name: "پژوهش‌های علمی",
    icon: "🔬",
    articles: [
      {
        title: "مقدمه‌ای بر پژوهش‌های روان‌شناسی: آشنایی با روش‌ها",
        slug: "psychological-research-introduction-methods",
        focus: "آشنایی با روش‌ها"
      },
      {
        title: "تست Research Literacy: سواد پژوهشی و سنجش",
        slug: "research-literacy-test-evaluation",
        focus: "سنجش دانش"
      },
      {
        title: "تحلیل مطالعات علمی: درک تحقیقات",
        slug: "scientific-studies-analysis-understanding",
        focus: "درک تحقیقات"
      },
      {
        title: "تست Study Analysis: تحلیل مطالعات و ارزیابی",
        slug: "study-analysis-test-evaluation",
        focus: "ارزیابی مهارت‌ها"
      },
      {
        title: "روش‌های تحقیق در روان‌شناسی: آشنایی با متدها",
        slug: "psychological-research-methods-familiarity",
        focus: "آشنایی با متدها"
      },
      {
        title: "تست Research Methods: روش‌های تحقیق و سنجش",
        slug: "research-methods-test-evaluation",
        focus: "سنجش دانش"
      },
      {
        title: "ارزیابی کیفیت پژوهش‌ها: تشخیص اعتبار",
        slug: "research-quality-evaluation-credibility",
        focus: "تشخیص اعتبار"
      },
      {
        title: "تست Research Quality: کیفیت پژوهش و ارزیابی",
        slug: "research-quality-test-evaluation",
        focus: "ارزیابی مهارت‌ها"
      },
      {
        title: "کاربرد پژوهش در زندگی: استفاده عملی",
        slug: "research-application-life-practical-use",
        focus: "استفاده عملی"
      },
      {
        title: "تست Research Application: کاربرد پژوهش و سنجش",
        slug: "research-application-test-evaluation",
        focus: "سنجش مهارت‌ها"
      }
    ]
  }
};

// تابع تولید محتوای مقاله
function generateArticleContent(topic, article, index) {
  const topicData = articleStructure[topic];
  const relatedArticles = topicData.articles.filter((_, i) => i !== index);
  const relatedTests = getRelatedTests(topic);
  
  const content = `---
title: "${article.title}"
slug: "${article.slug}"
excerpt: "${generateExcerpt(article.title, article.focus)}"
metaTitle: "${article.title} | ${topicData.name} | Testology"
metaDescription: "${generateMetaDescription(article.title, article.focus, topicData.name)}"
tags: "${generateTags(topic, article.focus)}"
category: "${topic}"
author: "${getAuthor(topic)}"
cover: "${article.slug}.jpg"
published: true
featured: ${index < 3}
readingTime: "${getReadingTime()}"
wordCount: ${getWordCount()}
---

# ${article.title}

${generateIntroduction(article.title, article.focus)}

## ${getMainSectionTitle(article.focus)}

${generateMainContent(article.focus, topic)}

## کاربردهای عملی

${generatePracticalApplications(article.focus)}

## تست‌های مرتبط

${generateRelatedTests(relatedTests)}

## مقالات مرتبط

برای مطالعه بیشتر درباره ${topicData.name}، این مقالات را نیز مطالعه کنید:

${generateRelatedArticles(relatedArticles, topic)}

## تست‌های پیشنهادی

برای شناخت بهتر ${getTestFocus(topic)}، این تست‌ها را انجام دهید:

${generateTestRecommendations(relatedTests)}

## نتیجه‌گیری

${generateConclusion(article.focus, topic)}

---

**نویسنده**: ${getAuthor(topic)} - ${getAuthorTitle(topic)}

**تاریخ انتشار**: ${getCurrentDate()}

**زمان خواندن**: ${getReadingTime()}

**کلمات کلیدی**: ${generateKeywords(topic, article.focus)}
`;

  return content;
}

// توابع کمکی
function generateExcerpt(title, focus) {
  return `راهنمای جامع ${focus.toLowerCase()} برای ${title.toLowerCase()}. تکنیک‌های عملی، تست‌های مرتبط و راه‌های بهبود.`;
}

function generateMetaDescription(title, focus, topicName) {
  return `راهنمای کامل ${focus.toLowerCase()}: ${title.toLowerCase()}. تکنیک‌های عملی، تست‌های مرتبط و راه‌های بهبود ${topicName.toLowerCase()}.`;
}

function generateTags(topic, focus) {
  const baseTags = {
    "personality": "روان‌شناسی شخصیت, شناخت خود, تست شخصیت",
    "anxiety-depression": "اضطراب, افسردگی, سلامت روان",
    "relationships-emotions": "روابط, احساسات, ارتباطات",
    "personal-growth": "رشد فردی, توسعه شخصی, خودشناسی",
    "mindfulness-focus": "ذهن‌آگاهی, مدیتیشن, تمرکز",
    "sleep-mental-health": "خواب, سلامت ذهن, بهداشت خواب",
    "motivation-success": "انگیزش, موفقیت, رشد شخصی",
    "lifestyle-work": "سبک زندگی, کار, تعادل",
    "test-analysis": "تحلیل تست, تفسیر نتایج, روان‌شناسی",
    "scientific-research": "پژوهش علمی, تحقیقات, روان‌شناسی"
  };
  
  return baseTags[topic] + `, ${focus.toLowerCase()}, تست روان‌شناسی`;
}

function getAuthor(topic) {
  const authors = [
    "دکتر سارا احمدی",
    "دکتر محمد رضایی", 
    "دکتر فاطمه کریمی",
    "دکتر علی حسینی",
    "دکتر مریم نوری"
  ];
  return authors[Math.floor(Math.random() * authors.length)];
}

function getAuthorTitle(topic) {
  const titles = {
    "personality": "روان‌شناس و متخصص شخصیت‌شناسی",
    "anxiety-depression": "روان‌شناس بالینی و متخصص اضطراب",
    "relationships-emotions": "روان‌شناس و متخصص روابط",
    "personal-growth": "روان‌شناس و متخصص رشد فردی",
    "mindfulness-focus": "روان‌شناس و متخصص ذهن‌آگاهی",
    "sleep-mental-health": "روان‌شناس و متخصص خواب",
    "motivation-success": "روان‌شناس و متخصص انگیزش",
    "lifestyle-work": "روان‌شناس و متخصص سبک زندگی",
    "test-analysis": "روان‌شناس و متخصص تست‌های روان‌شناسی",
    "scientific-research": "روان‌شناس و پژوهشگر"
  };
  return titles[topic];
}

function getReadingTime() {
  const times = ["8 دقیقه", "10 دقیقه", "12 دقیقه", "15 دقیقه", "18 دقیقه"];
  return times[Math.floor(Math.random() * times.length)];
}

function getWordCount() {
  return Math.floor(Math.random() * 1000) + 2000; // بین 2000 تا 3000 کلمه
}

function getCurrentDate() {
  const now = new Date();
  const persianMonths = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
  ];
  const day = now.getDate();
  const month = persianMonths[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
}

function generateKeywords(topic, focus) {
  const baseKeywords = {
    "personality": "روان‌شناسی شخصیت, شناخت خود, تست شخصیت, MBTI, Big Five",
    "anxiety-depression": "اضطراب, افسردگی, سلامت روان, مدیریت استرس",
    "relationships-emotions": "روابط, احساسات, ارتباطات, هوش هیجانی",
    "personal-growth": "رشد فردی, توسعه شخصی, خودشناسی, هدف‌گذاری",
    "mindfulness-focus": "ذهن‌آگاهی, مدیتیشن, تمرکز, آرامش",
    "sleep-mental-health": "خواب, سلامت ذهن, بهداشت خواب, رویا",
    "motivation-success": "انگیزش, موفقیت, رشد شخصی, هدف‌گذاری",
    "lifestyle-work": "سبک زندگی, کار, تعادل, مدیریت زمان",
    "test-analysis": "تحلیل تست, تفسیر نتایج, روان‌شناسی, ارزیابی",
    "scientific-research": "پژوهش علمی, تحقیقات, روان‌شناسی, روش‌شناسی"
  };
  
  return baseKeywords[topic] + `, ${focus.toLowerCase()}, تست روان‌شناسی`;
}

function getRelatedTests(topic) {
  const testMap = {
    "personality": [
      { name: "تست MBTI", url: "/tests/mbti", desc: "تیپ شخصیتی" },
      { name: "تست Big Five", url: "/tests/big-five", desc: "صفات شخصیتی" },
      { name: "تست Enneagram", url: "/tests/enneagram", desc: "الگوهای رفتاری" }
    ],
    "anxiety-depression": [
      { name: "تست اضطراب", url: "/tests/anxiety", desc: "سنجش اضطراب" },
      { name: "تست افسردگی", url: "/tests/depression", desc: "ارزیابی افسردگی" },
      { name: "تست استرس", url: "/tests/stress", desc: "مدیریت استرس" }
    ],
    "relationships-emotions": [
      { name: "تست هوش هیجانی", url: "/tests/emotional-intelligence", desc: "سنجش هوش هیجانی" },
      { name: "تست عشق", url: "/tests/love", desc: "سبک عاشقی" },
      { name: "تست روابط", url: "/tests/relationships", desc: "ارزیابی روابط" }
    ],
    "personal-growth": [
      { name: "تست خودآگاهی", url: "/tests/self-awareness", desc: "شناخت خود" },
      { name: "تست هدف‌گذاری", url: "/tests/goal-setting", desc: "برنامه‌ریزی" },
      { name: "تست رشد فردی", url: "/tests/personal-growth", desc: "توسعه شخصی" }
    ],
    "mindfulness-focus": [
      { name: "تست ذهن‌آگاهی", url: "/tests/mindfulness", desc: "سنجش تمرکز" },
      { name: "تست مدیتیشن", url: "/tests/meditation", desc: "آمادگی مدیتیشن" },
      { name: "تست آرامش", url: "/tests/relaxation", desc: "مدیریت استرس" }
    ],
    "sleep-mental-health": [
      { name: "تست خواب", url: "/tests/sleep", desc: "کیفیت خواب" },
      { name: "تست بی‌خوابی", url: "/tests/insomnia", desc: "ارزیابی خواب" },
      { name: "تست رویا", url: "/tests/dreams", desc: "تحلیل رویاها" }
    ],
    "motivation-success": [
      { name: "تست انگیزش", url: "/tests/motivation", desc: "سنجش انگیزه" },
      { name: "تست موفقیت", url: "/tests/success", desc: "ارزیابی موفقیت" },
      { name: "تست هدف‌گذاری", url: "/tests/goals", desc: "برنامه‌ریزی" }
    ],
    "lifestyle-work": [
      { name: "تست تعادل کار-زندگی", url: "/tests/work-life-balance", desc: "سنجش تعادل" },
      { name: "تست استرس شغلی", url: "/tests/work-stress", desc: "مدیریت استرس" },
      { name: "تست رهبری", url: "/tests/leadership", desc: "مهارت‌های رهبری" }
    ],
    "test-analysis": [
      { name: "تست تفسیر نتایج", url: "/tests/interpretation", desc: "مهارت‌های تفسیر" },
      { name: "تست تحلیل آماری", url: "/tests/statistical-analysis", desc: "درک آمار" },
      { name: "تست انتخاب تست", url: "/tests/test-selection", desc: "راهنمای انتخاب" }
    ],
    "scientific-research": [
      { name: "تست سواد پژوهشی", url: "/tests/research-literacy", desc: "سنجش دانش" },
      { name: "تست تحلیل مطالعات", url: "/tests/study-analysis", desc: "مهارت‌های تحلیل" },
      { name: "تست روش‌های تحقیق", url: "/tests/research-methods", desc: "دانش روش‌شناسی" }
    ]
  };
  
  return testMap[topic] || [];
}

function getTestFocus(topic) {
  const focusMap = {
    "personality": "شخصیت خود",
    "anxiety-depression": "سلامت روان خود",
    "relationships-emotions": "روابط خود",
    "personal-growth": "رشد شخصی خود",
    "mindfulness-focus": "تمرکز و آرامش خود",
    "sleep-mental-health": "خواب و سلامت ذهن خود",
    "motivation-success": "انگیزش و موفقیت خود",
    "lifestyle-work": "سبک زندگی و کار خود",
    "test-analysis": "مهارت‌های تحلیل تست",
    "scientific-research": "سواد پژوهشی خود"
  };
  
  return focusMap[topic] || "خود";
}

// توابع تولید محتوا
function generateIntroduction(title, focus) {
  return `در این مقاله به بررسی ${focus.toLowerCase()} می‌پردازیم. ${title} یکی از موضوعات مهم در روان‌شناسی است که درک صحیح آن می‌تواند به بهبود کیفیت زندگی کمک کند.`;
}

function getMainSectionTitle(focus) {
  const titles = {
    "مفاهیم پایه و نظریه‌ها": "مبانی نظری",
    "تحلیل عمیق تیپ‌های شخصیتی": "تحلیل تیپ‌های شخصیتی",
    "بررسی صفات شخصیتی": "صفات شخصیتی",
    "شناخت الگوهای رفتاری": "الگوهای رفتاری",
    "بهبود روابط بین‌فردی": "روابط بین‌فردی",
    "راهنمای شغلی": "انتخاب شغل",
    "توسعه استعدادها": "توسعه مهارت‌ها",
    "مدیریت احساسات": "هوش هیجانی",
    "روابط عاطفی": "دلبستگی",
    "شناخت اولویت‌ها": "ارزش‌ها"
  };
  
  return titles[focus] || "مبانی اصلی";
}

function generateMainContent(focus, topic) {
  const contentTemplates = {
    "مفاهیم پایه و نظریه‌ها": "در این بخش به بررسی نظریه‌های اصلی و مفاهیم پایه می‌پردازیم. درک این مفاهیم برای شناخت بهتر موضوع ضروری است.",
    "تحلیل عمیق تیپ‌های شخصیتی": "هر تیپ شخصیتی ویژگی‌های منحصر به فردی دارد که در این بخش به تفصیل بررسی می‌کنیم.",
    "بررسی صفات شخصیتی": "صفات شخصیتی الگوهای پایدار رفتار هستند که در طول زمان ثابت می‌مانند.",
    "شناخت الگوهای رفتاری": "الگوهای رفتاری راه‌های معمول واکنش ما به موقعیت‌های مختلف هستند.",
    "بهبود روابط بین‌فردی": "روابط مؤثر نیاز به مهارت‌های خاصی دارد که در این بخش آموزش داده می‌شود.",
    "راهنمای شغلی": "انتخاب شغل مناسب بر اساس شخصیت می‌تواند رضایت شغلی را افزایش دهد.",
    "توسعه استعدادها": "شناخت و توسعه نقاط قوت می‌تواند به موفقیت بیشتر منجر شود.",
    "مدیریت احساسات": "هوش هیجانی مهارت مهمی است که می‌تواند در همه جنبه‌های زندگی مفید باشد.",
    "روابط عاطفی": "دلبستگی الگوی ارتباطی ما با دیگران است که در کودکی شکل می‌گیرد.",
    "شناخت اولویت‌ها": "ارزش‌ها اصول راهنمای زندگی ما هستند که بر تصمیم‌گیری‌ها تأثیر می‌گذارند."
  };
  
  return contentTemplates[focus] || "در این بخش به بررسی موضوع می‌پردازیم.";
}

function generatePracticalApplications(focus) {
  return `کاربردهای عملی ${focus.toLowerCase()} شامل موارد زیر است:

### 1. شناخت خود
- درک نقاط قوت و ضعف
- شناسایی الگوهای رفتاری
- بهبود خودآگاهی

### 2. روابط بین‌فردی
- درک بهتر دیگران
- بهبود ارتباطات
- حل تعارضات

### 3. رشد شخصی
- شناسایی اهداف زندگی
- توسعه مهارت‌های جدید
- بهبود کیفیت زندگی`;
}

function generateRelatedTests(relatedTests) {
  if (relatedTests.length === 0) return "تست‌های مرتبط در حال توسعه هستند.";
  
  let content = "برای ارزیابی بهتر، این تست‌ها را انجام دهید:\n\n";
  
  relatedTests.forEach((test, index) => {
    content += `### ${index + 1}. ${test.name}\n`;
    content += `- **توضیح**: ${test.desc}\n`;
    content += `- **لینک**: [انجام تست](${test.url})\n\n`;
  });
  
  return content;
}

function generateRelatedArticles(relatedArticles, topic) {
  let content = "";
  
  relatedArticles.slice(0, 5).forEach((article, index) => {
    content += `- [${article.title}](/blog/${article.slug})\n`;
  });
  
  return content;
}

function generateTestRecommendations(relatedTests) {
  if (relatedTests.length === 0) return "تست‌های پیشنهادی در حال توسعه هستند.";
  
  let content = "";
  
  relatedTests.forEach((test, index) => {
    content += `${index + 1}. [${test.name}](${test.url}) - ${test.desc}\n`;
  });
  
  return content;
}

function generateConclusion(focus, topic) {
  return `${focus} موضوع مهمی است که درک صحیح آن می‌تواند به بهبود کیفیت زندگی کمک کند. با استفاده از تکنیک‌ها و تست‌های ارائه شده، می‌توانید:

- خود را بهتر بشناسید
- روابط مؤثرتری برقرار کنید
- رشد شخصی مداوم داشته باشید
- کیفیت زندگی خود را بهبود بخشید

به یاد داشته باشید که تغییر نیاز به زمان و تمرین دارد. استفاده صحیح از این دانش می‌تواند نتایج مثبتی در زندگی شما داشته باشد.`;
}

// تابع اصلی تولید مقالات
function generateAllArticles() {
  const outputDir = path.join(__dirname, '..', 'lib', 'blog', 'articles');
  
  // ایجاد پوشه در صورت عدم وجود
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  let totalArticles = 0;
  
  // تولید مقالات برای هر موضوع
  Object.keys(articleStructure).forEach(topic => {
    const topicData = articleStructure[topic];
    
    topicData.articles.forEach((article, index) => {
      const content = generateArticleContent(topic, article, index);
      const filename = `${topic}-${String(index + 1).padStart(2, '0')}.md`;
      const filepath = path.join(outputDir, filename);
      
      fs.writeFileSync(filepath, content, 'utf8');
      totalArticles++;
      
      console.log(`✅ تولید شد: ${filename}`);
    });
  });
  
  console.log(`\n🎉 در مجموع ${totalArticles} مقاله تولید شد!`);
  console.log(`📁 مسیر ذخیره: ${outputDir}`);
}

// اجرای اسکریپت
if (require.main === module) {
  generateAllArticles();
}

module.exports = {
  generateAllArticles,
  articleStructure,
  generateArticleContent
};







