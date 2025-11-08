const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, '..', 'app', 'api');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern 1: const completion = await \n const openai/client = getOpenAIClient();
  const pattern1 = /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+(openai|client)\s*=\s*getOpenAIClient\(\);/g;
  if (pattern1.test(content)) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+(openai|client)\s*=\s*getOpenAIClient\(\);/g,
      'const $2 = getOpenAIClient();\n      if (!$2) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const $1 = await $2.chat.completions.create('
    );
    modified = true;
  }

  // Pattern 2: const completion = await \n const openai/client = getOpenAIClient();\n if (!openai/client) {...}\n openai/client.chat
  const pattern2 = /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+(openai|client)\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!(\w+)\)[^}]*\}\s*\n\s*(\w+)\.chat/g;
  if (pattern2.test(content)) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+(openai|client)\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!(\w+)\)[^}]*\}\s*\n\s*(\w+)\.chat/g,
      'const $2 = getOpenAIClient();\n      if (!$2) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const $1 = await $2.chat'
    );
    modified = true;
  }

  // Pattern 3: const gptRes = await openai.chat.completions.create(\n if (!openai) {...}\n openai.chat
  const pattern3 = /const\s+(\w+)\s*=\s*await\s+(\w+)\.chat\.completions\.create\(\s*\n\s*if\s*\(!(\w+)\)[^}]*\}\s*\n\s*(\w+)\.chat/g;
  if (pattern3.test(content)) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*await\s+(\w+)\.chat\.completions\.create\(\s*\n\s*if\s*\(!(\w+)\)[^}]*\}\s*\n\s*(\w+)\.chat/g,
      'const $2 = getOpenAIClient();\n      if (!$2) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const $1 = await $2.chat'
    );
    modified = true;
  }

  // Pattern 4: const completion = await \n const client = getOpenAIClient();\n if (!client) {...}\n client.chat
  const pattern4 = /const\s+completion\s*=\s*await\s*\n\s*const\s+client\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!client\)[^}]*\}\s*\n\s*client\.chat/g;
  if (pattern4.test(content)) {
    content = content.replace(
      /const\s+completion\s*=\s*await\s*\n\s*const\s+client\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!client\)[^}]*\}\s*\n\s*client\.chat/g,
      'const client = getOpenAIClient();\n      if (!client) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const completion = await client.chat'
    );
    modified = true;
  }

  // Pattern 5: const res = await \n const openai = getOpenAIClient();\n if (!openai) {...}\n openai.chat
  const pattern5 = /const\s+res\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g;
  if (pattern5.test(content)) {
    content = content.replace(
      /const\s+res\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g,
      'const openai = getOpenAIClient();\n      if (!openai) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const res = await openai.chat'
    );
    modified = true;
  }

  // Pattern 6: const gptRes = await openai.chat.completions.create(\n if (!openai) {...}\n openai.chat
  const pattern6 = /const\s+gptRes\s*=\s*await\s+openai\.chat\.completions\.create\(\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g;
  if (pattern6.test(content)) {
    content = content.replace(
      /const\s+gptRes\s*=\s*await\s+openai\.chat\.completions\.create\(\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g,
      'const openai = getOpenAIClient();\n      if (!openai) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const gptRes = await openai.chat'
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
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
      if (fixFile(filePath)) {
        count++;
      }
    }
  }

  return count;
}

console.log('Fixing all OpenAI syntax issues...');
const fixed = walkDir(API_DIR);
console.log(`Fixed ${fixed} files.`);

const path = require('path');

const API_DIR = path.join(__dirname, '..', 'app', 'api');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern 1: const completion = await \n const openai/client = getOpenAIClient();
  const pattern1 = /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+(openai|client)\s*=\s*getOpenAIClient\(\);/g;
  if (pattern1.test(content)) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+(openai|client)\s*=\s*getOpenAIClient\(\);/g,
      'const $2 = getOpenAIClient();\n      if (!$2) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const $1 = await $2.chat.completions.create('
    );
    modified = true;
  }

  // Pattern 2: const completion = await \n const openai/client = getOpenAIClient();\n if (!openai/client) {...}\n openai/client.chat
  const pattern2 = /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+(openai|client)\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!(\w+)\)[^}]*\}\s*\n\s*(\w+)\.chat/g;
  if (pattern2.test(content)) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+(openai|client)\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!(\w+)\)[^}]*\}\s*\n\s*(\w+)\.chat/g,
      'const $2 = getOpenAIClient();\n      if (!$2) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const $1 = await $2.chat'
    );
    modified = true;
  }

  // Pattern 3: const gptRes = await openai.chat.completions.create(\n if (!openai) {...}\n openai.chat
  const pattern3 = /const\s+(\w+)\s*=\s*await\s+(\w+)\.chat\.completions\.create\(\s*\n\s*if\s*\(!(\w+)\)[^}]*\}\s*\n\s*(\w+)\.chat/g;
  if (pattern3.test(content)) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*await\s+(\w+)\.chat\.completions\.create\(\s*\n\s*if\s*\(!(\w+)\)[^}]*\}\s*\n\s*(\w+)\.chat/g,
      'const $2 = getOpenAIClient();\n      if (!$2) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const $1 = await $2.chat'
    );
    modified = true;
  }

  // Pattern 4: const completion = await \n const client = getOpenAIClient();\n if (!client) {...}\n client.chat
  const pattern4 = /const\s+completion\s*=\s*await\s*\n\s*const\s+client\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!client\)[^}]*\}\s*\n\s*client\.chat/g;
  if (pattern4.test(content)) {
    content = content.replace(
      /const\s+completion\s*=\s*await\s*\n\s*const\s+client\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!client\)[^}]*\}\s*\n\s*client\.chat/g,
      'const client = getOpenAIClient();\n      if (!client) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const completion = await client.chat'
    );
    modified = true;
  }

  // Pattern 5: const res = await \n const openai = getOpenAIClient();\n if (!openai) {...}\n openai.chat
  const pattern5 = /const\s+res\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g;
  if (pattern5.test(content)) {
    content = content.replace(
      /const\s+res\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g,
      'const openai = getOpenAIClient();\n      if (!openai) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const res = await openai.chat'
    );
    modified = true;
  }

  // Pattern 6: const gptRes = await openai.chat.completions.create(\n if (!openai) {...}\n openai.chat
  const pattern6 = /const\s+gptRes\s*=\s*await\s+openai\.chat\.completions\.create\(\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g;
  if (pattern6.test(content)) {
    content = content.replace(
      /const\s+gptRes\s*=\s*await\s+openai\.chat\.completions\.create\(\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g,
      'const openai = getOpenAIClient();\n      if (!openai) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const gptRes = await openai.chat'
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
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
      if (fixFile(filePath)) {
        count++;
      }
    }
  }

  return count;
}

console.log('Fixing all OpenAI syntax issues...');
const fixed = walkDir(API_DIR);
console.log(`Fixed ${fixed} files.`);

const path = require('path');

const API_DIR = path.join(__dirname, '..', 'app', 'api');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern 1: const completion = await \n const openai/client = getOpenAIClient();
  const pattern1 = /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+(openai|client)\s*=\s*getOpenAIClient\(\);/g;
  if (pattern1.test(content)) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+(openai|client)\s*=\s*getOpenAIClient\(\);/g,
      'const $2 = getOpenAIClient();\n      if (!$2) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const $1 = await $2.chat.completions.create('
    );
    modified = true;
  }

  // Pattern 2: const completion = await \n const openai/client = getOpenAIClient();\n if (!openai/client) {...}\n openai/client.chat
  const pattern2 = /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+(openai|client)\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!(\w+)\)[^}]*\}\s*\n\s*(\w+)\.chat/g;
  if (pattern2.test(content)) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*await\s*\n\s*const\s+(openai|client)\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!(\w+)\)[^}]*\}\s*\n\s*(\w+)\.chat/g,
      'const $2 = getOpenAIClient();\n      if (!$2) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const $1 = await $2.chat'
    );
    modified = true;
  }

  // Pattern 3: const gptRes = await openai.chat.completions.create(\n if (!openai) {...}\n openai.chat
  const pattern3 = /const\s+(\w+)\s*=\s*await\s+(\w+)\.chat\.completions\.create\(\s*\n\s*if\s*\(!(\w+)\)[^}]*\}\s*\n\s*(\w+)\.chat/g;
  if (pattern3.test(content)) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*await\s+(\w+)\.chat\.completions\.create\(\s*\n\s*if\s*\(!(\w+)\)[^}]*\}\s*\n\s*(\w+)\.chat/g,
      'const $2 = getOpenAIClient();\n      if (!$2) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const $1 = await $2.chat'
    );
    modified = true;
  }

  // Pattern 4: const completion = await \n const client = getOpenAIClient();\n if (!client) {...}\n client.chat
  const pattern4 = /const\s+completion\s*=\s*await\s*\n\s*const\s+client\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!client\)[^}]*\}\s*\n\s*client\.chat/g;
  if (pattern4.test(content)) {
    content = content.replace(
      /const\s+completion\s*=\s*await\s*\n\s*const\s+client\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!client\)[^}]*\}\s*\n\s*client\.chat/g,
      'const client = getOpenAIClient();\n      if (!client) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const completion = await client.chat'
    );
    modified = true;
  }

  // Pattern 5: const res = await \n const openai = getOpenAIClient();\n if (!openai) {...}\n openai.chat
  const pattern5 = /const\s+res\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g;
  if (pattern5.test(content)) {
    content = content.replace(
      /const\s+res\s*=\s*await\s*\n\s*const\s+openai\s*=\s*getOpenAIClient\(\);\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g,
      'const openai = getOpenAIClient();\n      if (!openai) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const res = await openai.chat'
    );
    modified = true;
  }

  // Pattern 6: const gptRes = await openai.chat.completions.create(\n if (!openai) {...}\n openai.chat
  const pattern6 = /const\s+gptRes\s*=\s*await\s+openai\.chat\.completions\.create\(\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g;
  if (pattern6.test(content)) {
    content = content.replace(
      /const\s+gptRes\s*=\s*await\s+openai\.chat\.completions\.create\(\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g,
      'const openai = getOpenAIClient();\n      if (!openai) {\n        return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n      }\n\n      const gptRes = await openai.chat'
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
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
      if (fixFile(filePath)) {
        count++;
      }
    }
  }

  return count;
}

console.log('Fixing all OpenAI syntax issues...');
const fixed = walkDir(API_DIR);
console.log(`Fixed ${fixed} files.`);




