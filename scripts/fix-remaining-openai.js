const fs = require('fs');
const path = require('path');

const files = [
  'app/api/psychologist-chat/route.ts',
  'app/api/support-chat/route.ts',
  'app/api/save-test-result/route.ts',
  'app/api/analyze-test/route.ts',
  'app/api/analyze-motivation-goals/route.ts',
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix pattern: const completion = await \n const openai = ...
  content = content.replace(
    /(\s+const\s+completion\s*=\s*await\s*)\n(\s+const\s+openai\s*=\s*getOpenAIClient\(\);)\n(\s+if\s*\(!openai\)[^}]*\}\s*)\n(\s*openai\.)/g,
    '$2\n$3\n\n$1$4'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${file}`);
});

console.log('Done!');

const path = require('path');

const files = [
  'app/api/psychologist-chat/route.ts',
  'app/api/support-chat/route.ts',
  'app/api/save-test-result/route.ts',
  'app/api/analyze-test/route.ts',
  'app/api/analyze-motivation-goals/route.ts',
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix pattern: const completion = await \n const openai = ...
  content = content.replace(
    /(\s+const\s+completion\s*=\s*await\s*)\n(\s+const\s+openai\s*=\s*getOpenAIClient\(\);)\n(\s+if\s*\(!openai\)[^}]*\}\s*)\n(\s*openai\.)/g,
    '$2\n$3\n\n$1$4'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${file}`);
});

console.log('Done!');

const path = require('path');

const files = [
  'app/api/psychologist-chat/route.ts',
  'app/api/support-chat/route.ts',
  'app/api/save-test-result/route.ts',
  'app/api/analyze-test/route.ts',
  'app/api/analyze-motivation-goals/route.ts',
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix pattern: const completion = await \n const openai = ...
  content = content.replace(
    /(\s+const\s+completion\s*=\s*await\s*)\n(\s+const\s+openai\s*=\s*getOpenAIClient\(\);)\n(\s+if\s*\(!openai\)[^}]*\}\s*)\n(\s*openai\.)/g,
    '$2\n$3\n\n$1$4'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${file}`);
});

console.log('Done!');




