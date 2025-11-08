const fs = require('fs');
const path = require('path');

// تابع برای تبدیل خط تیره به camelCase
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

const dataDir = path.join(__dirname, '../app/data');
const problematicFiles = [
  'bis-bas-questions.ts',
  'cd-risc-questions.ts',
  'decision-making-questions.ts',
  'emotion-regulation-questions.ts',
  'neo-ffi-questions.ts',
  'problem-solving-questions.ts',
  'scs-y-questions.ts',
  'stress-management-questions.ts',
  'time-management-questions.ts',
  'work-life-balance-questions.ts',
  'motivation-goals-questions.ts'
];

problematicFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  ${file} not found, skipping...`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const testId = file.replace('-questions.ts', '');
  const varName = toCamelCase(testId) + 'Questions';
  
  // اصلاح نام متغیر در export
  const wrongVarName = testId.replace(/-/g, '-') + 'Questions';
  content = content.replace(
    new RegExp(`export const ${testId.replace(/-/g, '\\-')}Questions`, 'g'),
    `export const ${varName}`
  );
  
  // اگر هنوز مشکل دارد، با regex دقیق‌تر
  content = content.replace(
    /export const ([a-z]+(?:-[a-z]+)+)Questions: Question\[\]/g,
    (match, testIdPart) => {
      return `export const ${toCamelCase(testIdPart)}Questions: Question[]`;
    }
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed ${file} -> ${varName}`);
});

console.log(`\n✨ Fixed ${problematicFiles.length} files!`);

