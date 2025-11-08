const fs = require('fs');
const path = require('path');

// مدل‌های گمشده که باید return 501 شوند
const missingModels = [
  'suggestedContent',
  'therapist',
  'therapistAssignment', 
  'therapistPatient',
  'videoLog',
  'weeklyAssignment',
  'testRequest',
  'blogComment'
];

// فایل‌های API که باید اصلاح شوند
const apiDir = path.join(__dirname, '../app/api');

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // جایگزینی مدل‌های گمشده
  missingModels.forEach(model => {
    // پیدا کردن تمام استفاده‌ها از prisma.model
    const regex = new RegExp(`prisma\\.${model}\\.(\\w+)\\([^)]*\\)`, 'gs');
    content = content.replace(regex, (match, method) => {
      // اگر در یک async function هستیم، return 501 کنیم
      if (match.includes('await')) {
        return `(async () => { return NextResponse.json({ error: '${model} model not in schema', message: 'Feature requires database schema update' }, { status: 501 }) })()`;
      }
      return match;
    });
  });
  
  // جایگزینی therapistSession به therapySession
  content = content.replace(/prisma\.therapistSession/g, 'prisma.therapySession');
  
  // جایگزینی screeningAnalysis به ScreeningResult
  content = content.replace(/prisma\.screeningAnalysis/g, 'prisma.screeningResult');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// پیدا کردن همه فایل‌های route.ts
function findRouteFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findRouteFiles(fullPath));
    } else if (item.name === 'route.ts') {
      files.push(fullPath);
    }
  }
  
  return files;
}

const routeFiles = findRouteFiles(apiDir);
let fixedCount = 0;

routeFiles.forEach(file => {
  if (fixFile(file)) {
    fixedCount++;
    console.log(`✅ Fixed ${path.relative(apiDir, file)}`);
  }
});

console.log(`\n✨ Fixed ${fixedCount} out of ${routeFiles.length} route files!`);

