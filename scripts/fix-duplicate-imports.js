const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../app/data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('-questions.ts'));

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // حذف import های تکراری
  content = content.replace(/(import \{ normalizeQuestions \} from ['"]@\/lib\/helpers\/question-helper['"]\s*)+/g, 'import { normalizeQuestions } from \'@/lib/helpers/question-helper\'\n');
  
  // اطمینان از اینکه import ها در جای درست هستند
  if (content.includes('import { Question }')) {
    const questionImport = content.match(/import \{ Question \} from ['"]@\/types\/test['"]/);
    const normalizeImport = content.match(/import \{ normalizeQuestions \} from ['"]@\/lib\/helpers\/question-helper['"]/);
    
    if (questionImport && normalizeImport) {
      // اگر normalizeQuestions بعد از Question است، آن را به بعد از Question منتقل کن
      if (content.indexOf(normalizeImport[0]) > content.indexOf(questionImport[0])) {
        content = content.replace(normalizeImport[0], '');
        content = content.replace(questionImport[0], questionImport[0] + '\n' + normalizeImport[0]);
      }
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed imports in ${file}`);
});

console.log(`\n✨ Fixed imports in ${files.length} files!`);

