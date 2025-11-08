const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../app/data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('-questions.ts') && f !== 'test-questions.ts' && f !== 'gad7-questions.ts' && f !== 'stai-questions.ts');

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // استخراج testId از نام فایل (مثلاً stai-questions.ts -> stai)
  const testId = file.replace('-questions.ts', '');
  const varName = `${testId}Questions`;
  
  // اگر قبلاً اصلاح شده، رد کن
  if (content.includes('normalizeQuestions')) {
    console.log(`⏭️  ${file} already fixed, skipping...`);
    return;
  }
  
  // اضافه کردن import ها
  if (!content.includes('normalizeQuestions')) {
    content = content.replace(
      /import { Question } from ['"]\.\.\/\.\.\/types\/test['"]/,
      `import { Question } from '@/types/test'\nimport { normalizeQuestions } from '@/lib/helpers/question-helper'`
    );
    content = content.replace(
      /import { Question } from ['"]@\/types\/test['"]/,
      `import { Question } from '@/types/test'\nimport { normalizeQuestions } from '@/lib/helpers/question-helper'`
    );
  }
  
  // اضافه کردن RawQuestion type
  if (!content.includes('RawQuestion')) {
    const importLine = content.indexOf('import');
    const nextLine = content.indexOf('\n', importLine) + 1;
    content = content.slice(0, nextLine) + 
      '\n// فقط فیلدهای خام هر سؤال\n' +
      'type RawQuestion = Pick<Question, \'text\' | \'options\'>\n\n' +
      content.slice(nextLine);
  }
  
  // تبدیل export const xxxQuestions: Question[] = [...] به const rawQuestions: RawQuestion[] = [...]
  const exportRegex = new RegExp(`export const ${varName}: Question\\[\\] = \\[`, 'g');
  content = content.replace(exportRegex, 'const rawQuestions: RawQuestion[] = [');
  
  // حذف همه id: "..." از سؤال‌ها
  content = content.replace(/^\s+id: ["']\d+["'],?\s*$/gm, '');
  
  // اضافه کردن normalizeQuestions در انتهای آرایه
  const arrayEndRegex = /(\]\s*)(export const|export default|export const \w+Options)/;
  if (arrayEndRegex.test(content)) {
    content = content.replace(
      arrayEndRegex,
      `$1\n\n// خروجی نهایی با فیلدهای اجباری تکمیل می‌شود\nexport const ${varName}: Question[] = normalizeQuestions(rawQuestions, {\n  testId: '${testId}',\n  type: 'SINGLE_CHOICE',\n  required: true\n})\n\n$2`
    );
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed ${file}`);
});

console.log(`\n✨ Fixed ${files.length} question files!`);

