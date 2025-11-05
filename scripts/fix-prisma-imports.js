const fs = require('fs');
const path = require('path');

// تابع برای پیدا کردن تمام فایل‌های route.ts
function findRouteFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findRouteFiles(fullPath));
    } else if (item === 'route.ts') {
      files.push(fullPath);
    }
  }
  
  return files;
}

// تابع برای اصلاح import های Prisma
function fixPrismaImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // الگوهای مختلف import که باید اصلاح شوند
    const patterns = [
      {
        from: /import\s*{\s*prisma\s*}\s*from\s*['"]@\/lib\/prisma['"]/g,
        to: "import prisma from '@/lib/prisma'"
      },
      {
        from: /import\s*{\s*prisma\s*}\s*from\s*['"]\.\.\/\.\.\/\.\.\/lib\/prisma['"]/g,
        to: "import prisma from '../../../lib/prisma'"
      },
      {
        from: /import\s*{\s*prisma\s*}\s*from\s*['"]\.\.\/\.\.\/lib\/prisma['"]/g,
        to: "import prisma from '../../lib/prisma'"
      },
      {
        from: /import\s*{\s*prisma\s*}\s*from\s*['"]\.\.\/lib\/prisma['"]/g,
        to: "import prisma from '../lib/prisma'"
      }
    ];
    
    patterns.forEach(pattern => {
      if (pattern.from.test(content)) {
        content = content.replace(pattern.from, pattern.to);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// اجرای اسکریپت
console.log('🔧 شروع اصلاح import های Prisma...\n');

const apiDir = path.join(__dirname, '..', 'app', 'api');
const routeFiles = findRouteFiles(apiDir);

console.log(`📁 پیدا شد ${routeFiles.length} فایل route.ts\n`);

let fixedCount = 0;
let errorCount = 0;

routeFiles.forEach(file => {
  try {
    if (fixPrismaImports(file)) {
      fixedCount++;
    }
  } catch (error) {
    console.error(`❌ خطا در ${file}:`, error.message);
    errorCount++;
  }
});

console.log(`\n📊 خلاصه نتایج:`);
console.log(`✅ اصلاح شده: ${fixedCount} فایل`);
console.log(`❌ خطا: ${errorCount} فایل`);
console.log(`📁 کل فایل‌ها: ${routeFiles.length} فایل`);

if (fixedCount > 0) {
  console.log(`\n🎉 ${fixedCount} فایل با موفقیت اصلاح شد!`);
} else {
  console.log(`\nℹ️ هیچ فایلی نیاز به اصلاح نداشت.`);
}





