const fs = require('fs');
const path = require('path');

// Fix duplicate keys in app/tests/[id]/page.tsx
const testFile = path.join(__dirname, '../app/tests/[id]/page.tsx');
let content = fs.readFileSync(testFile, 'utf8');

// Find and remove duplicate keys - we need to keep only the first occurrence
const lines = content.split('\n');
const seenKeys = new Set();
const newLines = [];
let inObject = false;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const keyMatch = line.match(/^\s*"([^"]+)":\s*\{/);
  
  if (keyMatch) {
    const key = keyMatch[1];
    if (seenKeys.has(key)) {
      // Skip this duplicate entry - find where it ends
      let skipBraceCount = 1;
      let skipIndex = i + 1;
      while (skipBraceCount > 0 && skipIndex < lines.length) {
        const skipLine = lines[skipIndex];
        skipBraceCount += (skipLine.match(/\{/g) || []).length;
        skipBraceCount -= (skipLine.match(/\}/g) || []).length;
        skipIndex++;
      }
      i = skipIndex - 1;
      continue;
    }
    seenKeys.add(key);
  }
  
  newLines.push(line);
}

fs.writeFileSync(testFile, newLines.join('\n'), 'utf8');
console.log('Fixed duplicate keys in app/tests/[id]/page.tsx');

// Fix lib/blog/blog-utils.ts - replace isActive with published
const blogUtilsFile = path.join(__dirname, '../lib/blog/blog-utils.ts');
let blogUtilsContent = fs.readFileSync(blogUtilsFile, 'utf8');
blogUtilsContent = blogUtilsContent.replace(/isActive:\s*true/g, 'published: true');
fs.writeFileSync(blogUtilsFile, blogUtilsContent, 'utf8');
console.log('Fixed isActive -> published in lib/blog/blog-utils.ts');

// Fix lib/blog/article-importer.ts - remove isAdmin
const articleImporterFile = path.join(__dirname, '../lib/blog/article-importer.ts');
let articleImporterContent = fs.readFileSync(articleImporterFile, 'utf8');
articleImporterContent = articleImporterContent.replace(/,\s*isAdmin:\s*true/g, '');
fs.writeFileSync(articleImporterFile, articleImporterContent, 'utf8');
console.log('Fixed isAdmin in lib/blog/article-importer.ts');

// Fix lib/notifications.ts - remove action field
const notificationsFile = path.join(__dirname, '../lib/notifications.ts');
let notificationsContent = fs.readFileSync(notificationsFile, 'utf8');
notificationsContent = notificationsContent.replace(/action:\s*action\s*\|\|\s*null/g, '');
notificationsContent = notificationsContent.replace(/,\s*action:\s*action\s*\|\|\s*null/g, '');
fs.writeFileSync(notificationsFile, notificationsContent, 'utf8');
console.log('Fixed action field in lib/notifications.ts');

// Fix lib/cache.ts and lib/security.ts - use Array.from
const cacheFile = path.join(__dirname, '../lib/cache.ts');
let cacheContent = fs.readFileSync(cacheFile, 'utf8');
cacheContent = cacheContent.replace(/for\s*\(const\s*\[key,\s*item\]\s*of\s*this\.cache\.entries\(\)\)/g, 
  'for (const [key, item] of Array.from(this.cache.entries()))');
fs.writeFileSync(cacheFile, cacheContent, 'utf8');
console.log('Fixed cache.ts iteration');

const securityFile = path.join(__dirname, '../lib/security.ts');
let securityContent = fs.readFileSync(securityFile, 'utf8');
securityContent = securityContent.replace(/for\s*\(const\s*\[key,\s*entry\]\s*of\s*this\.limits\.entries\(\)\)/g,
  'for (const [key, entry] of Array.from(this.limits.entries()))');
fs.writeFileSync(securityFile, securityContent, 'utf8');
console.log('Fixed security.ts iteration');

// Fix lib/seo/analytics-events.ts - add global type declarations
const analyticsEventsFile = path.join(__dirname, '../lib/seo/analytics-events.ts');
let analyticsEventsContent = fs.readFileSync(analyticsEventsFile, 'utf8');
if (!analyticsEventsContent.includes('declare global')) {
  const declareGlobal = `declare global {
  var gtag: ((command: string, targetId: string, config?: any) => void) | undefined;
  var fbq: ((command: string, event: string, params?: any) => void) | undefined;
  var analytics: {
    track: (event: string, params?: any) => void;
  } | undefined;
}

`;
  analyticsEventsContent = declareGlobal + analyticsEventsContent;
  fs.writeFileSync(analyticsEventsFile, analyticsEventsContent, 'utf8');
  console.log('Added global declarations to lib/seo/analytics-events.ts');
}

// Fix lib/seo/hreflang.ts - change x-default to en
const hreflangFile = path.join(__dirname, '../lib/seo/hreflang.ts');
let hreflangContent = fs.readFileSync(hreflangFile, 'utf8');
hreflangContent = hreflangContent.replace(/hreflang:\s*'x-default'/g, "hreflang: 'en'");
fs.writeFileSync(hreflangFile, hreflangContent, 'utf8');
console.log('Fixed hreflang x-default');

// Fix lib/seo/seo-meta.ts - change undefined to null
const seoMetaFile = path.join(__dirname, '../lib/seo/seo-meta.ts');
let seoMetaContent = fs.readFileSync(seoMetaFile, 'utf8');
seoMetaContent = seoMetaContent.replace(/:\s*undefined/g, ': null');
fs.writeFileSync(seoMetaFile, seoMetaContent, 'utf8');
console.log('Fixed undefined in lib/seo/seo-meta.ts');

// Fix lib/seo/performance-monitor.ts - fix fcp to FCP
const perfMonitorFile = path.join(__dirname, '../lib/seo/performance-monitor.ts');
let perfMonitorContent = fs.readFileSync(perfMonitorFile, 'utf8');
perfMonitorContent = perfMonitorContent.replace(/PERFORMANCE_THRESHOLDS\[metric\]/g, 
  'PERFORMANCE_THRESHOLDS[metric.toUpperCase() as keyof typeof PERFORMANCE_THRESHOLDS]');
fs.writeFileSync(perfMonitorFile, perfMonitorContent, 'utf8');
console.log('Fixed fcp in lib/seo/performance-monitor.ts');

// Fix lib/services/gamification.ts - add type annotations
const gamificationFile = path.join(__dirname, '../lib/services/gamification.ts');
let gamificationContent = fs.readFileSync(gamificationFile, 'utf8');
gamificationContent = gamificationContent.replace(/\.map\(ub\s*=>/g, '.map((ub: any) =>');
gamificationContent = gamificationContent.replace(/\.sort\(\(a,\s*b\)\s*=>/g, '.sort((a: any, b: any) =>');
fs.writeFileSync(gamificationFile, gamificationContent, 'utf8');
console.log('Fixed type annotations in lib/services/gamification.ts');

// Fix lib/services/explore.ts - add null check
const exploreFile = path.join(__dirname, '../lib/services/explore.ts');
let exploreContent = fs.readFileSync(exploreFile, 'utf8');
exploreContent = exploreContent.replace(/testSlug:\s*test\.testSlug/g, 'testSlug: test.testSlug || ""');
fs.writeFileSync(exploreFile, exploreContent, 'utf8');
console.log('Fixed testSlug in lib/services/explore.ts');

// Fix lib/performance.ts - add window.gtag type
const performanceFile = path.join(__dirname, '../lib/performance.ts');
let performanceContent = fs.readFileSync(performanceFile, 'utf8');
if (!performanceContent.includes('declare global')) {
  const declareGlobal = `declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
  }
}

`;
  performanceContent = declareGlobal + performanceContent;
  fs.writeFileSync(performanceFile, performanceContent, 'utf8');
  console.log('Added window.gtag declaration to lib/performance.ts');
}

// Fix lib/performance-monitor.ts - add window.gtag type
const perfMonitorFile2 = path.join(__dirname, '../lib/performance-monitor.ts');
let perfMonitorContent2 = fs.readFileSync(perfMonitorFile2, 'utf8');
if (!perfMonitorContent2.includes('declare global')) {
  const declareGlobal = `declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
  }
}

`;
  perfMonitorContent2 = declareGlobal + perfMonitorContent2;
  fs.writeFileSync(perfMonitorFile2, perfMonitorContent2, 'utf8');
  console.log('Added window.gtag declaration to lib/performance-monitor.ts');
}

// Fix lib/lazy-imports.ts - comment out problematic dynamic import
const lazyImportsFile = path.join(__dirname, '../lib/lazy-imports.ts');
let lazyImportsContent = fs.readFileSync(lazyImportsFile, 'utf8');
lazyImportsContent = lazyImportsContent.replace(
  /export const LazyLucideIcons = dynamic\(\(\) => import\('lucide-react'\),/g,
  "export const LazyLucideIcons = dynamic(() => import('lucide-react') as any,"
);
fs.writeFileSync(lazyImportsFile, lazyImportsContent, 'utf8');
console.log('Fixed lazy-imports.ts');

// Fix lib/i18n/detectLanguage.ts - fix module declaration
const detectLanguageFile = path.join(__dirname, '../lib/i18n/detectLanguage.ts');
let detectLanguageContent = fs.readFileSync(detectLanguageFile, 'utf8');
detectLanguageContent = detectLanguageContent.replace(
  /declare module 'accept-language-parser' \{[\s\S]*?\}/,
  "// @ts-ignore\nimport parser from 'accept-language-parser';\n"
);
fs.writeFileSync(detectLanguageFile, detectLanguageContent, 'utf8');
console.log('Fixed accept-language-parser declaration');

console.log('All fixes applied!');

const path = require('path');

// Fix duplicate keys in app/tests/[id]/page.tsx
const testFile = path.join(__dirname, '../app/tests/[id]/page.tsx');
let content = fs.readFileSync(testFile, 'utf8');

// Find and remove duplicate keys - we need to keep only the first occurrence
const lines = content.split('\n');
const seenKeys = new Set();
const newLines = [];
let inObject = false;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const keyMatch = line.match(/^\s*"([^"]+)":\s*\{/);
  
  if (keyMatch) {
    const key = keyMatch[1];
    if (seenKeys.has(key)) {
      // Skip this duplicate entry - find where it ends
      let skipBraceCount = 1;
      let skipIndex = i + 1;
      while (skipBraceCount > 0 && skipIndex < lines.length) {
        const skipLine = lines[skipIndex];
        skipBraceCount += (skipLine.match(/\{/g) || []).length;
        skipBraceCount -= (skipLine.match(/\}/g) || []).length;
        skipIndex++;
      }
      i = skipIndex - 1;
      continue;
    }
    seenKeys.add(key);
  }
  
  newLines.push(line);
}

fs.writeFileSync(testFile, newLines.join('\n'), 'utf8');
console.log('Fixed duplicate keys in app/tests/[id]/page.tsx');

// Fix lib/blog/blog-utils.ts - replace isActive with published
const blogUtilsFile = path.join(__dirname, '../lib/blog/blog-utils.ts');
let blogUtilsContent = fs.readFileSync(blogUtilsFile, 'utf8');
blogUtilsContent = blogUtilsContent.replace(/isActive:\s*true/g, 'published: true');
fs.writeFileSync(blogUtilsFile, blogUtilsContent, 'utf8');
console.log('Fixed isActive -> published in lib/blog/blog-utils.ts');

// Fix lib/blog/article-importer.ts - remove isAdmin
const articleImporterFile = path.join(__dirname, '../lib/blog/article-importer.ts');
let articleImporterContent = fs.readFileSync(articleImporterFile, 'utf8');
articleImporterContent = articleImporterContent.replace(/,\s*isAdmin:\s*true/g, '');
fs.writeFileSync(articleImporterFile, articleImporterContent, 'utf8');
console.log('Fixed isAdmin in lib/blog/article-importer.ts');

// Fix lib/notifications.ts - remove action field
const notificationsFile = path.join(__dirname, '../lib/notifications.ts');
let notificationsContent = fs.readFileSync(notificationsFile, 'utf8');
notificationsContent = notificationsContent.replace(/action:\s*action\s*\|\|\s*null/g, '');
notificationsContent = notificationsContent.replace(/,\s*action:\s*action\s*\|\|\s*null/g, '');
fs.writeFileSync(notificationsFile, notificationsContent, 'utf8');
console.log('Fixed action field in lib/notifications.ts');

// Fix lib/cache.ts and lib/security.ts - use Array.from
const cacheFile = path.join(__dirname, '../lib/cache.ts');
let cacheContent = fs.readFileSync(cacheFile, 'utf8');
cacheContent = cacheContent.replace(/for\s*\(const\s*\[key,\s*item\]\s*of\s*this\.cache\.entries\(\)\)/g, 
  'for (const [key, item] of Array.from(this.cache.entries()))');
fs.writeFileSync(cacheFile, cacheContent, 'utf8');
console.log('Fixed cache.ts iteration');

const securityFile = path.join(__dirname, '../lib/security.ts');
let securityContent = fs.readFileSync(securityFile, 'utf8');
securityContent = securityContent.replace(/for\s*\(const\s*\[key,\s*entry\]\s*of\s*this\.limits\.entries\(\)\)/g,
  'for (const [key, entry] of Array.from(this.limits.entries()))');
fs.writeFileSync(securityFile, securityContent, 'utf8');
console.log('Fixed security.ts iteration');

// Fix lib/seo/analytics-events.ts - add global type declarations
const analyticsEventsFile = path.join(__dirname, '../lib/seo/analytics-events.ts');
let analyticsEventsContent = fs.readFileSync(analyticsEventsFile, 'utf8');
if (!analyticsEventsContent.includes('declare global')) {
  const declareGlobal = `declare global {
  var gtag: ((command: string, targetId: string, config?: any) => void) | undefined;
  var fbq: ((command: string, event: string, params?: any) => void) | undefined;
  var analytics: {
    track: (event: string, params?: any) => void;
  } | undefined;
}

`;
  analyticsEventsContent = declareGlobal + analyticsEventsContent;
  fs.writeFileSync(analyticsEventsFile, analyticsEventsContent, 'utf8');
  console.log('Added global declarations to lib/seo/analytics-events.ts');
}

// Fix lib/seo/hreflang.ts - change x-default to en
const hreflangFile = path.join(__dirname, '../lib/seo/hreflang.ts');
let hreflangContent = fs.readFileSync(hreflangFile, 'utf8');
hreflangContent = hreflangContent.replace(/hreflang:\s*'x-default'/g, "hreflang: 'en'");
fs.writeFileSync(hreflangFile, hreflangContent, 'utf8');
console.log('Fixed hreflang x-default');

// Fix lib/seo/seo-meta.ts - change undefined to null
const seoMetaFile = path.join(__dirname, '../lib/seo/seo-meta.ts');
let seoMetaContent = fs.readFileSync(seoMetaFile, 'utf8');
seoMetaContent = seoMetaContent.replace(/:\s*undefined/g, ': null');
fs.writeFileSync(seoMetaFile, seoMetaContent, 'utf8');
console.log('Fixed undefined in lib/seo/seo-meta.ts');

// Fix lib/seo/performance-monitor.ts - fix fcp to FCP
const perfMonitorFile = path.join(__dirname, '../lib/seo/performance-monitor.ts');
let perfMonitorContent = fs.readFileSync(perfMonitorFile, 'utf8');
perfMonitorContent = perfMonitorContent.replace(/PERFORMANCE_THRESHOLDS\[metric\]/g, 
  'PERFORMANCE_THRESHOLDS[metric.toUpperCase() as keyof typeof PERFORMANCE_THRESHOLDS]');
fs.writeFileSync(perfMonitorFile, perfMonitorContent, 'utf8');
console.log('Fixed fcp in lib/seo/performance-monitor.ts');

// Fix lib/services/gamification.ts - add type annotations
const gamificationFile = path.join(__dirname, '../lib/services/gamification.ts');
let gamificationContent = fs.readFileSync(gamificationFile, 'utf8');
gamificationContent = gamificationContent.replace(/\.map\(ub\s*=>/g, '.map((ub: any) =>');
gamificationContent = gamificationContent.replace(/\.sort\(\(a,\s*b\)\s*=>/g, '.sort((a: any, b: any) =>');
fs.writeFileSync(gamificationFile, gamificationContent, 'utf8');
console.log('Fixed type annotations in lib/services/gamification.ts');

// Fix lib/services/explore.ts - add null check
const exploreFile = path.join(__dirname, '../lib/services/explore.ts');
let exploreContent = fs.readFileSync(exploreFile, 'utf8');
exploreContent = exploreContent.replace(/testSlug:\s*test\.testSlug/g, 'testSlug: test.testSlug || ""');
fs.writeFileSync(exploreFile, exploreContent, 'utf8');
console.log('Fixed testSlug in lib/services/explore.ts');

// Fix lib/performance.ts - add window.gtag type
const performanceFile = path.join(__dirname, '../lib/performance.ts');
let performanceContent = fs.readFileSync(performanceFile, 'utf8');
if (!performanceContent.includes('declare global')) {
  const declareGlobal = `declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
  }
}

`;
  performanceContent = declareGlobal + performanceContent;
  fs.writeFileSync(performanceFile, performanceContent, 'utf8');
  console.log('Added window.gtag declaration to lib/performance.ts');
}

// Fix lib/performance-monitor.ts - add window.gtag type
const perfMonitorFile2 = path.join(__dirname, '../lib/performance-monitor.ts');
let perfMonitorContent2 = fs.readFileSync(perfMonitorFile2, 'utf8');
if (!perfMonitorContent2.includes('declare global')) {
  const declareGlobal = `declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
  }
}

`;
  perfMonitorContent2 = declareGlobal + perfMonitorContent2;
  fs.writeFileSync(perfMonitorFile2, perfMonitorContent2, 'utf8');
  console.log('Added window.gtag declaration to lib/performance-monitor.ts');
}

// Fix lib/lazy-imports.ts - comment out problematic dynamic import
const lazyImportsFile = path.join(__dirname, '../lib/lazy-imports.ts');
let lazyImportsContent = fs.readFileSync(lazyImportsFile, 'utf8');
lazyImportsContent = lazyImportsContent.replace(
  /export const LazyLucideIcons = dynamic\(\(\) => import\('lucide-react'\),/g,
  "export const LazyLucideIcons = dynamic(() => import('lucide-react') as any,"
);
fs.writeFileSync(lazyImportsFile, lazyImportsContent, 'utf8');
console.log('Fixed lazy-imports.ts');

// Fix lib/i18n/detectLanguage.ts - fix module declaration
const detectLanguageFile = path.join(__dirname, '../lib/i18n/detectLanguage.ts');
let detectLanguageContent = fs.readFileSync(detectLanguageFile, 'utf8');
detectLanguageContent = detectLanguageContent.replace(
  /declare module 'accept-language-parser' \{[\s\S]*?\}/,
  "// @ts-ignore\nimport parser from 'accept-language-parser';\n"
);
fs.writeFileSync(detectLanguageFile, detectLanguageContent, 'utf8');
console.log('Fixed accept-language-parser declaration');

console.log('All fixes applied!');

const path = require('path');

// Fix duplicate keys in app/tests/[id]/page.tsx
const testFile = path.join(__dirname, '../app/tests/[id]/page.tsx');
let content = fs.readFileSync(testFile, 'utf8');

// Find and remove duplicate keys - we need to keep only the first occurrence
const lines = content.split('\n');
const seenKeys = new Set();
const newLines = [];
let inObject = false;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const keyMatch = line.match(/^\s*"([^"]+)":\s*\{/);
  
  if (keyMatch) {
    const key = keyMatch[1];
    if (seenKeys.has(key)) {
      // Skip this duplicate entry - find where it ends
      let skipBraceCount = 1;
      let skipIndex = i + 1;
      while (skipBraceCount > 0 && skipIndex < lines.length) {
        const skipLine = lines[skipIndex];
        skipBraceCount += (skipLine.match(/\{/g) || []).length;
        skipBraceCount -= (skipLine.match(/\}/g) || []).length;
        skipIndex++;
      }
      i = skipIndex - 1;
      continue;
    }
    seenKeys.add(key);
  }
  
  newLines.push(line);
}

fs.writeFileSync(testFile, newLines.join('\n'), 'utf8');
console.log('Fixed duplicate keys in app/tests/[id]/page.tsx');

// Fix lib/blog/blog-utils.ts - replace isActive with published
const blogUtilsFile = path.join(__dirname, '../lib/blog/blog-utils.ts');
let blogUtilsContent = fs.readFileSync(blogUtilsFile, 'utf8');
blogUtilsContent = blogUtilsContent.replace(/isActive:\s*true/g, 'published: true');
fs.writeFileSync(blogUtilsFile, blogUtilsContent, 'utf8');
console.log('Fixed isActive -> published in lib/blog/blog-utils.ts');

// Fix lib/blog/article-importer.ts - remove isAdmin
const articleImporterFile = path.join(__dirname, '../lib/blog/article-importer.ts');
let articleImporterContent = fs.readFileSync(articleImporterFile, 'utf8');
articleImporterContent = articleImporterContent.replace(/,\s*isAdmin:\s*true/g, '');
fs.writeFileSync(articleImporterFile, articleImporterContent, 'utf8');
console.log('Fixed isAdmin in lib/blog/article-importer.ts');

// Fix lib/notifications.ts - remove action field
const notificationsFile = path.join(__dirname, '../lib/notifications.ts');
let notificationsContent = fs.readFileSync(notificationsFile, 'utf8');
notificationsContent = notificationsContent.replace(/action:\s*action\s*\|\|\s*null/g, '');
notificationsContent = notificationsContent.replace(/,\s*action:\s*action\s*\|\|\s*null/g, '');
fs.writeFileSync(notificationsFile, notificationsContent, 'utf8');
console.log('Fixed action field in lib/notifications.ts');

// Fix lib/cache.ts and lib/security.ts - use Array.from
const cacheFile = path.join(__dirname, '../lib/cache.ts');
let cacheContent = fs.readFileSync(cacheFile, 'utf8');
cacheContent = cacheContent.replace(/for\s*\(const\s*\[key,\s*item\]\s*of\s*this\.cache\.entries\(\)\)/g, 
  'for (const [key, item] of Array.from(this.cache.entries()))');
fs.writeFileSync(cacheFile, cacheContent, 'utf8');
console.log('Fixed cache.ts iteration');

const securityFile = path.join(__dirname, '../lib/security.ts');
let securityContent = fs.readFileSync(securityFile, 'utf8');
securityContent = securityContent.replace(/for\s*\(const\s*\[key,\s*entry\]\s*of\s*this\.limits\.entries\(\)\)/g,
  'for (const [key, entry] of Array.from(this.limits.entries()))');
fs.writeFileSync(securityFile, securityContent, 'utf8');
console.log('Fixed security.ts iteration');

// Fix lib/seo/analytics-events.ts - add global type declarations
const analyticsEventsFile = path.join(__dirname, '../lib/seo/analytics-events.ts');
let analyticsEventsContent = fs.readFileSync(analyticsEventsFile, 'utf8');
if (!analyticsEventsContent.includes('declare global')) {
  const declareGlobal = `declare global {
  var gtag: ((command: string, targetId: string, config?: any) => void) | undefined;
  var fbq: ((command: string, event: string, params?: any) => void) | undefined;
  var analytics: {
    track: (event: string, params?: any) => void;
  } | undefined;
}

`;
  analyticsEventsContent = declareGlobal + analyticsEventsContent;
  fs.writeFileSync(analyticsEventsFile, analyticsEventsContent, 'utf8');
  console.log('Added global declarations to lib/seo/analytics-events.ts');
}

// Fix lib/seo/hreflang.ts - change x-default to en
const hreflangFile = path.join(__dirname, '../lib/seo/hreflang.ts');
let hreflangContent = fs.readFileSync(hreflangFile, 'utf8');
hreflangContent = hreflangContent.replace(/hreflang:\s*'x-default'/g, "hreflang: 'en'");
fs.writeFileSync(hreflangFile, hreflangContent, 'utf8');
console.log('Fixed hreflang x-default');

// Fix lib/seo/seo-meta.ts - change undefined to null
const seoMetaFile = path.join(__dirname, '../lib/seo/seo-meta.ts');
let seoMetaContent = fs.readFileSync(seoMetaFile, 'utf8');
seoMetaContent = seoMetaContent.replace(/:\s*undefined/g, ': null');
fs.writeFileSync(seoMetaFile, seoMetaContent, 'utf8');
console.log('Fixed undefined in lib/seo/seo-meta.ts');

// Fix lib/seo/performance-monitor.ts - fix fcp to FCP
const perfMonitorFile = path.join(__dirname, '../lib/seo/performance-monitor.ts');
let perfMonitorContent = fs.readFileSync(perfMonitorFile, 'utf8');
perfMonitorContent = perfMonitorContent.replace(/PERFORMANCE_THRESHOLDS\[metric\]/g, 
  'PERFORMANCE_THRESHOLDS[metric.toUpperCase() as keyof typeof PERFORMANCE_THRESHOLDS]');
fs.writeFileSync(perfMonitorFile, perfMonitorContent, 'utf8');
console.log('Fixed fcp in lib/seo/performance-monitor.ts');

// Fix lib/services/gamification.ts - add type annotations
const gamificationFile = path.join(__dirname, '../lib/services/gamification.ts');
let gamificationContent = fs.readFileSync(gamificationFile, 'utf8');
gamificationContent = gamificationContent.replace(/\.map\(ub\s*=>/g, '.map((ub: any) =>');
gamificationContent = gamificationContent.replace(/\.sort\(\(a,\s*b\)\s*=>/g, '.sort((a: any, b: any) =>');
fs.writeFileSync(gamificationFile, gamificationContent, 'utf8');
console.log('Fixed type annotations in lib/services/gamification.ts');

// Fix lib/services/explore.ts - add null check
const exploreFile = path.join(__dirname, '../lib/services/explore.ts');
let exploreContent = fs.readFileSync(exploreFile, 'utf8');
exploreContent = exploreContent.replace(/testSlug:\s*test\.testSlug/g, 'testSlug: test.testSlug || ""');
fs.writeFileSync(exploreFile, exploreContent, 'utf8');
console.log('Fixed testSlug in lib/services/explore.ts');

// Fix lib/performance.ts - add window.gtag type
const performanceFile = path.join(__dirname, '../lib/performance.ts');
let performanceContent = fs.readFileSync(performanceFile, 'utf8');
if (!performanceContent.includes('declare global')) {
  const declareGlobal = `declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
  }
}

`;
  performanceContent = declareGlobal + performanceContent;
  fs.writeFileSync(performanceFile, performanceContent, 'utf8');
  console.log('Added window.gtag declaration to lib/performance.ts');
}

// Fix lib/performance-monitor.ts - add window.gtag type
const perfMonitorFile2 = path.join(__dirname, '../lib/performance-monitor.ts');
let perfMonitorContent2 = fs.readFileSync(perfMonitorFile2, 'utf8');
if (!perfMonitorContent2.includes('declare global')) {
  const declareGlobal = `declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
  }
}

`;
  perfMonitorContent2 = declareGlobal + perfMonitorContent2;
  fs.writeFileSync(perfMonitorFile2, perfMonitorContent2, 'utf8');
  console.log('Added window.gtag declaration to lib/performance-monitor.ts');
}

// Fix lib/lazy-imports.ts - comment out problematic dynamic import
const lazyImportsFile = path.join(__dirname, '../lib/lazy-imports.ts');
let lazyImportsContent = fs.readFileSync(lazyImportsFile, 'utf8');
lazyImportsContent = lazyImportsContent.replace(
  /export const LazyLucideIcons = dynamic\(\(\) => import\('lucide-react'\),/g,
  "export const LazyLucideIcons = dynamic(() => import('lucide-react') as any,"
);
fs.writeFileSync(lazyImportsFile, lazyImportsContent, 'utf8');
console.log('Fixed lazy-imports.ts');

// Fix lib/i18n/detectLanguage.ts - fix module declaration
const detectLanguageFile = path.join(__dirname, '../lib/i18n/detectLanguage.ts');
let detectLanguageContent = fs.readFileSync(detectLanguageFile, 'utf8');
detectLanguageContent = detectLanguageContent.replace(
  /declare module 'accept-language-parser' \{[\s\S]*?\}/,
  "// @ts-ignore\nimport parser from 'accept-language-parser';\n"
);
fs.writeFileSync(detectLanguageFile, detectLanguageContent, 'utf8');
console.log('Fixed accept-language-parser declaration');

console.log('All fixes applied!');













