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
  'work-life-balance-questions.ts'
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
  
  // تبدیل export const xxxQuestions: Question[] = [...] به const rawQuestions: RawQuestion[] = [...]
  const exportRegex = new RegExp(`export const ${varName}: Question\\[\\] = \\[`, 'g');
  if (exportRegex.test(content)) {
    content = content.replace(exportRegex, 'const rawQuestions: RawQuestion[] = [');
    console.log(`✅ Fixed export in ${file}`);
  }
  
  // حذف همه id: "..." از سؤال‌ها
  content = content.replace(/^\s+id: ["']\d+["'],?\s*$/gm, '');
  
  // اگر normalizeQuestions وجود ندارد، اضافه کن
  if (!content.includes('normalizeQuestions(rawQuestions')) {
    // پیدا کردن انتهای آرایه
    const arrayEndMatch = content.match(/(\]\s*)(export|export default|export const \w+Options)/);
    if (arrayEndMatch) {
      content = content.replace(
        arrayEndMatch[0],
        `]\n\n// خروجی نهایی با فیلدهای اجباری تکمیل می‌شود\nexport const ${varName}: Question[] = normalizeQuestions(rawQuestions, {\n  testId: '${testId}',\n  type: 'SINGLE_CHOICE',\n  required: true\n})\n\n${arrayEndMatch[2]}`
      );
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed ${file}`);
});

console.log(`\n✨ Fixed ${problematicFiles.length} question files!`);

