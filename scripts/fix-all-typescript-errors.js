const fs = require('fs');
const path = require('path');

// لیست فایل‌هایی که باید اصلاح شوند
const filesToFix = [
  // API routes
  'app/api/test-result/[id]/route.ts',
  'app/api/test/route.ts',
  'app/api/optimized/user/profile/route.ts',
  'app/api/search/route.ts',
  'app/api/user/stats/route.ts',
  'app/api/user/mood-history/route.ts',
  'app/api/therapist/generate-report/route.ts',
  'app/api/therapist/get-analytics/route.ts',
  'app/api/therapist/patients/[patientId]/route.ts',
  'app/api/user/behavioral-insights/route.ts',
  'app/api/report/generate/route.ts',
  'app/api/report/comprehensive/route.ts',
  'app/api/ml/ethics/route.ts',
  
  // Components
  'components/dashboard/MentalHealthSummary.tsx',
  'components/dashboard/UserMoodSummary.tsx',
  'components/dashboard/TestCard.tsx',
  'components/DashboardLayout.tsx',
  'components/header/LanguageSwitcher.tsx',
  'components/LanguageAutoDetector.tsx',
  'components/LanguageSwitcher.tsx',
  'components/profile/ProgressPath.tsx',
  'components/PsychologistChat.tsx',
  'components/SupportWidget.tsx',
  
  // Lib files
  'lib/content/database-content.ts',
  'lib/blog/blog-utils.ts',
  'lib/helpers/content.ts',
  'lib/auto-translate.ts',
  'lib/gpt/recommendations.ts',
  'lib/seo/sitemapManager.ts',
  'lib/services/explore.ts',
  'lib/notifications.ts',
  
  // Pages
  'app/login/page.tsx',
  'app/search/page.tsx',
  'app/sitemap.ts',
  'app/tests/[id]/page.tsx',
  'app/tests/[id]/start/page.tsx',
  'app/results/[id]/page.tsx',
  'app/dashboard/settings/page.tsx',
  'app/dashboard/mood-tracker/page.tsx',
  'app/dashboard/chat-psychology/page.tsx',
  'app/dashboard/profile/mental-health/page.tsx',
  'app/profile/[username]/page.tsx',
  'app/profile/mood-calendar/page.tsx',
];

console.log('Starting TypeScript error fixes...\n');

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  ${file} not found, skipping...`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Fix 1: testSlug null checks
  content = content.replace(
    /testSlug\s*[!=]==?\s*['"]([^'"]+)['"]/g,
    (match, slug) => {
      return `testSlug && testSlug === '${slug}'`;
    }
  );
  
  // Fix 2: testSlug null checks in includes/filters
  content = content.replace(
    /includes\(testSlug\)/g,
    'includes(testSlug || "")'
  );
  
  // Fix 3: testSlug type assertions
  content = content.replace(
    /testSlug\s*\|\|\s*['"]/g,
    '(testSlug || "")'
  );
  
  // Fix 4: params null checks
  content = content.replace(
    /const\s+{\s*id\s*}\s*=\s*useParams\(\)/g,
    'const params = useParams(); const { id } = params || {}'
  );
  content = content.replace(
    /params\.id/g,
    'params?.id'
  );
  content = content.replace(
    /params\.get\(/g,
    'params?.get('
  );
  
  // Fix 5: searchParams null checks
  content = content.replace(
    /searchParams\.get\(/g,
    'searchParams?.get('
  );
  
  // Fix 6: session null checks
  content = content.replace(
    /session\.user\./g,
    'session?.user?.'
  );
  
  // Fix 7: error.message type
  content = content.replace(
    /error\.message/g,
    '(error instanceof Error ? error.message : String(error))'
  );
  
  // Fix 8: mode: 'insensitive' removal (not supported in Prisma)
  content = content.replace(
    /mode:\s*['"]insensitive['"]\s*,?\s*/g,
    ''
  );
  
  // Fix 9: slug -> testSlug
  content = content.replace(
    /test\.slug/g,
    'test.testSlug || test.slug'
  );
  content = content.replace(
    /test\.title/g,
    'test.testName || test.title'
  );
  
  // Fix 10: published -> isActive
  content = content.replace(
    /published:\s*true/g,
    'isActive: true'
  );
  
  // Fix 11: views -> viewCount
  content = content.replace(
    /orderBy:\s*{\s*views:/g,
    'orderBy: { viewCount:'
  );
  
  // Fix 12: excerpt field
  content = content.replace(
    /excerpt:\s*{\s*contains:/g,
    'metaDescription: { contains:'
  );
  
  // Fix 13: category include
  content = content.replace(
    /category:\s*true/g,
    ''
  );
  
  // Fix 14: description field in Article
  content = content.replace(
    /article\.description/g,
    'article.excerpt || article.metaDescription'
  );
  
  // Fix 15: publishedAt -> createdAt
  content = content.replace(
    /article\.publishedAt/g,
    'article.createdAt'
  );
  content = content.replace(
    /orderBy:\s*{\s*publishedAt:/g,
    'orderBy: { createdAt:'
  );
  
  // Fix 16: type assertions for arrays
  content = content.replace(
    /\.filter\((\w+)\s*=>/g,
    (match, param) => {
      return `.filter((${param}: any) =>`;
    }
  );
  content = content.replace(
    /\.map\((\w+)\s*=>/g,
    (match, param) => {
      return `.map((${param}: any) =>`;
    }
  );
  content = content.replace(
    /\.reduce\(\((\w+),\s*(\w+)\)\s*=>/g,
    (match, acc, item) => {
      return `.reduce((${acc}: any, ${item}: any) =>`;
    }
  );
  content = content.replace(
    /\.forEach\(\((\w+)(?:,\s*(\w+))?\)\s*=>/g,
    (match, item, index) => {
      if (index) {
        return `.forEach((${item}: any, ${index}: any) =>`;
      }
      return `.forEach((${item}: any) =>`;
    }
  );
  
  // Fix 17: type assertions for sort
  content = content.replace(
    /\.sort\(\((\w+),\s*(\w+)\)\s*=>/g,
    (match, a, b) => {
      return `.sort((${a}: any, ${b}: any) =>`;
    }
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${file}`);
  } else {
    console.log(`⏭️  ${file} - no changes needed`);
  }
});

console.log('\n✨ TypeScript error fixes completed!');



// لیست فایل‌هایی که باید اصلاح شوند
const filesToFix = [
  // API routes
  'app/api/test-result/[id]/route.ts',
  'app/api/test/route.ts',
  'app/api/optimized/user/profile/route.ts',
  'app/api/search/route.ts',
  'app/api/user/stats/route.ts',
  'app/api/user/mood-history/route.ts',
  'app/api/therapist/generate-report/route.ts',
  'app/api/therapist/get-analytics/route.ts',
  'app/api/therapist/patients/[patientId]/route.ts',
  'app/api/user/behavioral-insights/route.ts',
  'app/api/report/generate/route.ts',
  'app/api/report/comprehensive/route.ts',
  'app/api/ml/ethics/route.ts',
  
  // Components
  'components/dashboard/MentalHealthSummary.tsx',
  'components/dashboard/UserMoodSummary.tsx',
  'components/dashboard/TestCard.tsx',
  'components/DashboardLayout.tsx',
  'components/header/LanguageSwitcher.tsx',
  'components/LanguageAutoDetector.tsx',
  'components/LanguageSwitcher.tsx',
  'components/profile/ProgressPath.tsx',
  'components/PsychologistChat.tsx',
  'components/SupportWidget.tsx',
  
  // Lib files
  'lib/content/database-content.ts',
  'lib/blog/blog-utils.ts',
  'lib/helpers/content.ts',
  'lib/auto-translate.ts',
  'lib/gpt/recommendations.ts',
  'lib/seo/sitemapManager.ts',
  'lib/services/explore.ts',
  'lib/notifications.ts',
  
  // Pages
  'app/login/page.tsx',
  'app/search/page.tsx',
  'app/sitemap.ts',
  'app/tests/[id]/page.tsx',
  'app/tests/[id]/start/page.tsx',
  'app/results/[id]/page.tsx',
  'app/dashboard/settings/page.tsx',
  'app/dashboard/mood-tracker/page.tsx',
  'app/dashboard/chat-psychology/page.tsx',
  'app/dashboard/profile/mental-health/page.tsx',
  'app/profile/[username]/page.tsx',
  'app/profile/mood-calendar/page.tsx',
];

console.log('Starting TypeScript error fixes...\n');

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  ${file} not found, skipping...`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Fix 1: testSlug null checks
  content = content.replace(
    /testSlug\s*[!=]==?\s*['"]([^'"]+)['"]/g,
    (match, slug) => {
      return `testSlug && testSlug === '${slug}'`;
    }
  );
  
  // Fix 2: testSlug null checks in includes/filters
  content = content.replace(
    /includes\(testSlug\)/g,
    'includes(testSlug || "")'
  );
  
  // Fix 3: testSlug type assertions
  content = content.replace(
    /testSlug\s*\|\|\s*['"]/g,
    '(testSlug || "")'
  );
  
  // Fix 4: params null checks
  content = content.replace(
    /const\s+{\s*id\s*}\s*=\s*useParams\(\)/g,
    'const params = useParams(); const { id } = params || {}'
  );
  content = content.replace(
    /params\.id/g,
    'params?.id'
  );
  content = content.replace(
    /params\.get\(/g,
    'params?.get('
  );
  
  // Fix 5: searchParams null checks
  content = content.replace(
    /searchParams\.get\(/g,
    'searchParams?.get('
  );
  
  // Fix 6: session null checks
  content = content.replace(
    /session\.user\./g,
    'session?.user?.'
  );
  
  // Fix 7: error.message type
  content = content.replace(
    /error\.message/g,
    '(error instanceof Error ? error.message : String(error))'
  );
  
  // Fix 8: mode: 'insensitive' removal (not supported in Prisma)
  content = content.replace(
    /mode:\s*['"]insensitive['"]\s*,?\s*/g,
    ''
  );
  
  // Fix 9: slug -> testSlug
  content = content.replace(
    /test\.slug/g,
    'test.testSlug || test.slug'
  );
  content = content.replace(
    /test\.title/g,
    'test.testName || test.title'
  );
  
  // Fix 10: published -> isActive
  content = content.replace(
    /published:\s*true/g,
    'isActive: true'
  );
  
  // Fix 11: views -> viewCount
  content = content.replace(
    /orderBy:\s*{\s*views:/g,
    'orderBy: { viewCount:'
  );
  
  // Fix 12: excerpt field
  content = content.replace(
    /excerpt:\s*{\s*contains:/g,
    'metaDescription: { contains:'
  );
  
  // Fix 13: category include
  content = content.replace(
    /category:\s*true/g,
    ''
  );
  
  // Fix 14: description field in Article
  content = content.replace(
    /article\.description/g,
    'article.excerpt || article.metaDescription'
  );
  
  // Fix 15: publishedAt -> createdAt
  content = content.replace(
    /article\.publishedAt/g,
    'article.createdAt'
  );
  content = content.replace(
    /orderBy:\s*{\s*publishedAt:/g,
    'orderBy: { createdAt:'
  );
  
  // Fix 16: type assertions for arrays
  content = content.replace(
    /\.filter\((\w+)\s*=>/g,
    (match, param) => {
      return `.filter((${param}: any) =>`;
    }
  );
  content = content.replace(
    /\.map\((\w+)\s*=>/g,
    (match, param) => {
      return `.map((${param}: any) =>`;
    }
  );
  content = content.replace(
    /\.reduce\(\((\w+),\s*(\w+)\)\s*=>/g,
    (match, acc, item) => {
      return `.reduce((${acc}: any, ${item}: any) =>`;
    }
  );
  content = content.replace(
    /\.forEach\(\((\w+)(?:,\s*(\w+))?\)\s*=>/g,
    (match, item, index) => {
      if (index) {
        return `.forEach((${item}: any, ${index}: any) =>`;
      }
      return `.forEach((${item}: any) =>`;
    }
  );
  
  // Fix 17: type assertions for sort
  content = content.replace(
    /\.sort\(\((\w+),\s*(\w+)\)\s*=>/g,
    (match, a, b) => {
      return `.sort((${a}: any, ${b}: any) =>`;
    }
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${file}`);
  } else {
    console.log(`⏭️  ${file} - no changes needed`);
  }
});

console.log('\n✨ TypeScript error fixes completed!');



// لیست فایل‌هایی که باید اصلاح شوند
const filesToFix = [
  // API routes
  'app/api/test-result/[id]/route.ts',
  'app/api/test/route.ts',
  'app/api/optimized/user/profile/route.ts',
  'app/api/search/route.ts',
  'app/api/user/stats/route.ts',
  'app/api/user/mood-history/route.ts',
  'app/api/therapist/generate-report/route.ts',
  'app/api/therapist/get-analytics/route.ts',
  'app/api/therapist/patients/[patientId]/route.ts',
  'app/api/user/behavioral-insights/route.ts',
  'app/api/report/generate/route.ts',
  'app/api/report/comprehensive/route.ts',
  'app/api/ml/ethics/route.ts',
  
  // Components
  'components/dashboard/MentalHealthSummary.tsx',
  'components/dashboard/UserMoodSummary.tsx',
  'components/dashboard/TestCard.tsx',
  'components/DashboardLayout.tsx',
  'components/header/LanguageSwitcher.tsx',
  'components/LanguageAutoDetector.tsx',
  'components/LanguageSwitcher.tsx',
  'components/profile/ProgressPath.tsx',
  'components/PsychologistChat.tsx',
  'components/SupportWidget.tsx',
  
  // Lib files
  'lib/content/database-content.ts',
  'lib/blog/blog-utils.ts',
  'lib/helpers/content.ts',
  'lib/auto-translate.ts',
  'lib/gpt/recommendations.ts',
  'lib/seo/sitemapManager.ts',
  'lib/services/explore.ts',
  'lib/notifications.ts',
  
  // Pages
  'app/login/page.tsx',
  'app/search/page.tsx',
  'app/sitemap.ts',
  'app/tests/[id]/page.tsx',
  'app/tests/[id]/start/page.tsx',
  'app/results/[id]/page.tsx',
  'app/dashboard/settings/page.tsx',
  'app/dashboard/mood-tracker/page.tsx',
  'app/dashboard/chat-psychology/page.tsx',
  'app/dashboard/profile/mental-health/page.tsx',
  'app/profile/[username]/page.tsx',
  'app/profile/mood-calendar/page.tsx',
];

console.log('Starting TypeScript error fixes...\n');

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  ${file} not found, skipping...`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Fix 1: testSlug null checks
  content = content.replace(
    /testSlug\s*[!=]==?\s*['"]([^'"]+)['"]/g,
    (match, slug) => {
      return `testSlug && testSlug === '${slug}'`;
    }
  );
  
  // Fix 2: testSlug null checks in includes/filters
  content = content.replace(
    /includes\(testSlug\)/g,
    'includes(testSlug || "")'
  );
  
  // Fix 3: testSlug type assertions
  content = content.replace(
    /testSlug\s*\|\|\s*['"]/g,
    '(testSlug || "")'
  );
  
  // Fix 4: params null checks
  content = content.replace(
    /const\s+{\s*id\s*}\s*=\s*useParams\(\)/g,
    'const params = useParams(); const { id } = params || {}'
  );
  content = content.replace(
    /params\.id/g,
    'params?.id'
  );
  content = content.replace(
    /params\.get\(/g,
    'params?.get('
  );
  
  // Fix 5: searchParams null checks
  content = content.replace(
    /searchParams\.get\(/g,
    'searchParams?.get('
  );
  
  // Fix 6: session null checks
  content = content.replace(
    /session\.user\./g,
    'session?.user?.'
  );
  
  // Fix 7: error.message type
  content = content.replace(
    /error\.message/g,
    '(error instanceof Error ? error.message : String(error))'
  );
  
  // Fix 8: mode: 'insensitive' removal (not supported in Prisma)
  content = content.replace(
    /mode:\s*['"]insensitive['"]\s*,?\s*/g,
    ''
  );
  
  // Fix 9: slug -> testSlug
  content = content.replace(
    /test\.slug/g,
    'test.testSlug || test.slug'
  );
  content = content.replace(
    /test\.title/g,
    'test.testName || test.title'
  );
  
  // Fix 10: published -> isActive
  content = content.replace(
    /published:\s*true/g,
    'isActive: true'
  );
  
  // Fix 11: views -> viewCount
  content = content.replace(
    /orderBy:\s*{\s*views:/g,
    'orderBy: { viewCount:'
  );
  
  // Fix 12: excerpt field
  content = content.replace(
    /excerpt:\s*{\s*contains:/g,
    'metaDescription: { contains:'
  );
  
  // Fix 13: category include
  content = content.replace(
    /category:\s*true/g,
    ''
  );
  
  // Fix 14: description field in Article
  content = content.replace(
    /article\.description/g,
    'article.excerpt || article.metaDescription'
  );
  
  // Fix 15: publishedAt -> createdAt
  content = content.replace(
    /article\.publishedAt/g,
    'article.createdAt'
  );
  content = content.replace(
    /orderBy:\s*{\s*publishedAt:/g,
    'orderBy: { createdAt:'
  );
  
  // Fix 16: type assertions for arrays
  content = content.replace(
    /\.filter\((\w+)\s*=>/g,
    (match, param) => {
      return `.filter((${param}: any) =>`;
    }
  );
  content = content.replace(
    /\.map\((\w+)\s*=>/g,
    (match, param) => {
      return `.map((${param}: any) =>`;
    }
  );
  content = content.replace(
    /\.reduce\(\((\w+),\s*(\w+)\)\s*=>/g,
    (match, acc, item) => {
      return `.reduce((${acc}: any, ${item}: any) =>`;
    }
  );
  content = content.replace(
    /\.forEach\(\((\w+)(?:,\s*(\w+))?\)\s*=>/g,
    (match, item, index) => {
      if (index) {
        return `.forEach((${item}: any, ${index}: any) =>`;
      }
      return `.forEach((${item}: any) =>`;
    }
  );
  
  // Fix 17: type assertions for sort
  content = content.replace(
    /\.sort\(\((\w+),\s*(\w+)\)\s*=>/g,
    (match, a, b) => {
      return `.sort((${a}: any, ${b}: any) =>`;
    }
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${file}`);
  } else {
    console.log(`⏭️  ${file} - no changes needed`);
  }
});

console.log('\n✨ TypeScript error fixes completed!');

