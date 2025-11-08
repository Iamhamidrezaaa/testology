const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/data/motivation-goals-questions.ts');
let content = fs.readFileSync(filePath, 'utf8');

// حذف همه id ها
content = content.replace(/^\s+id: ["'][^"']+["'],?\s*$/gm, '');

// تبدیل options از { label, value } به string array
content = content.replace(
  /options: \[\s*(\{[^}]+\}(?:\s*,\s*\{[^}]+\})*)\s*\]/g,
  (match, optionsStr) => {
    // استخراج label ها
    const labels = [];
    const labelRegex = /label:\s*["']([^"']+)["']/g;
    let labelMatch;
    while ((labelMatch = labelRegex.exec(optionsStr)) !== null) {
      labels.push(labelMatch[1]);
    }
    return `options: [\n${labels.map(l => `      "${l}"`).join(',\n')}\n    ]`;
  }
);

// اضافه کردن normalizeQuestions در انتها
if (!content.includes('normalizeQuestions')) {
  content = content.replace(
    /(\]\s*);\s*export default/,
    `]\n\n// خروجی نهایی با فیلدهای اجباری تکمیل می‌شود\nexport const motivationGoalsQuestions: Question[] = normalizeQuestions(rawQuestions, {\n  testId: 'motivation-goals',\n  type: 'SINGLE_CHOICE',\n  required: true\n})\n\nexport default`
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed motivation-goals-questions.ts');

