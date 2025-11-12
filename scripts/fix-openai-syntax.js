const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, '..', 'app', 'api');

function fixSyntaxErrors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix broken await statements
  const brokenAwaitPattern = /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);/g;
  if (brokenAwaitPattern.test(content)) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);/g,
      'const openai = getOpenAIClient();\n    if (!openai) {\n      return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n    }\n\n    const $1 = await openai.chat.completions.create('
    );
    modified = true;
  }

  // Fix broken await with openai on next line
  const brokenAwaitNextLine = /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\./g;
  if (brokenAwaitNextLine.test(content)) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\./g,
      'const openai = getOpenAIClient();\n    if (!openai) {\n      return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n    }\n\n    const $1 = await openai.'
    );
    modified = true;
  }

  // More specific pattern for the exact error we're seeing
  const specificPattern = /(\s+const\s+\w+\s*=\s*await\s*)\n(\s+const\s+openai\s*=\s*getOpenAIClient\(\);)\n(\s+if\s*\(!openai\)[^}]*\}\s*)\n(\s*openai\.)/g;
  if (specificPattern.test(content)) {
    content = content.replace(
      specificPattern,
      '$2\n$3\n\n$1$4'
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed syntax: ${filePath}`);
    return true;
  }

  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      count += walkDir(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      if (fixSyntaxErrors(filePath)) {
        count++;
      }
    }
  }

  return count;
}

console.log('Fixing syntax errors in API routes...');
const fixed = walkDir(API_DIR);
console.log(`Fixed ${fixed} files.`);

const path = require('path');

const API_DIR = path.join(__dirname, '..', 'app', 'api');

function fixSyntaxErrors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix broken await statements
  const brokenAwaitPattern = /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);/g;
  if (brokenAwaitPattern.test(content)) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);/g,
      'const openai = getOpenAIClient();\n    if (!openai) {\n      return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n    }\n\n    const $1 = await openai.chat.completions.create('
    );
    modified = true;
  }

  // Fix broken await with openai on next line
  const brokenAwaitNextLine = /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\./g;
  if (brokenAwaitNextLine.test(content)) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\./g,
      'const openai = getOpenAIClient();\n    if (!openai) {\n      return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n    }\n\n    const $1 = await openai.'
    );
    modified = true;
  }

  // More specific pattern for the exact error we're seeing
  const specificPattern = /(\s+const\s+\w+\s*=\s*await\s*)\n(\s+const\s+openai\s*=\s*getOpenAIClient\(\);)\n(\s+if\s*\(!openai\)[^}]*\}\s*)\n(\s*openai\.)/g;
  if (specificPattern.test(content)) {
    content = content.replace(
      specificPattern,
      '$2\n$3\n\n$1$4'
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed syntax: ${filePath}`);
    return true;
  }

  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      count += walkDir(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      if (fixSyntaxErrors(filePath)) {
        count++;
      }
    }
  }

  return count;
}

console.log('Fixing syntax errors in API routes...');
const fixed = walkDir(API_DIR);
console.log(`Fixed ${fixed} files.`);

const path = require('path');

const API_DIR = path.join(__dirname, '..', 'app', 'api');

function fixSyntaxErrors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix broken await statements
  const brokenAwaitPattern = /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);/g;
  if (brokenAwaitPattern.test(content)) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);/g,
      'const openai = getOpenAIClient();\n    if (!openai) {\n      return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n    }\n\n    const $1 = await openai.chat.completions.create('
    );
    modified = true;
  }

  // Fix broken await with openai on next line
  const brokenAwaitNextLine = /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\./g;
  if (brokenAwaitNextLine.test(content)) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\./g,
      'const openai = getOpenAIClient();\n    if (!openai) {\n      return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n    }\n\n    const $1 = await openai.'
    );
    modified = true;
  }

  // More specific pattern for the exact error we're seeing
  const specificPattern = /(\s+const\s+\w+\s*=\s*await\s*)\n(\s+const\s+openai\s*=\s*getOpenAIClient\(\);)\n(\s+if\s*\(!openai\)[^}]*\}\s*)\n(\s*openai\.)/g;
  if (specificPattern.test(content)) {
    content = content.replace(
      specificPattern,
      '$2\n$3\n\n$1$4'
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed syntax: ${filePath}`);
    return true;
  }

  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      count += walkDir(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      if (fixSyntaxErrors(filePath)) {
        count++;
      }
    }
  }

  return count;
}

console.log('Fixing syntax errors in API routes...');
const fixed = walkDir(API_DIR);
console.log(`Fixed ${fixed} files.`);



















