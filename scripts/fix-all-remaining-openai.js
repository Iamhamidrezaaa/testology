const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, '..', 'app', 'api');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern: const ...Res/gpt/ethicalRes/etc = await openai.chat.completions.create(\n if (!openai) {...}\n openai.chat
  const brokenPattern = /const\s+(\w+)\s*=\s*await\s+openai\.chat\.completions\.create\(\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g;
  if (brokenPattern.test(content)) {
    content = content.replace(
      brokenPattern,
      'const $1 = await openai.chat'
    );
    modified = true;
  }

  // Pattern: const gptRes = await openai.chat.completions.create(\n if (!openai) {...}\n openai.chat
  const gptResPattern = /const\s+gptRes\s*=\s*await\s+openai\.chat\.completions\.create\(\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g;
  if (gptResPattern.test(content)) {
    content = content.replace(
      gptResPattern,
      'const gptRes = await openai.chat'
    );
    modified = true;
  }

  // Pattern: const ethicalRes = await openai.chat.completions.create(\n if (!openai) {...}\n openai.chat
  const ethicalPattern = /const\s+ethicalRes\s*=\s*await\s+openai\.chat\.completions\.create\(\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g;
  if (ethicalPattern.test(content)) {
    content = content.replace(
      ethicalPattern,
      'const ethicalRes = await openai.chat'
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

console.log('Fixing remaining OpenAI syntax issues...');
const fixed = walkDir(API_DIR);
console.log(`Fixed ${fixed} files.`);

const path = require('path');

const API_DIR = path.join(__dirname, '..', 'app', 'api');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern: const ...Res/gpt/ethicalRes/etc = await openai.chat.completions.create(\n if (!openai) {...}\n openai.chat
  const brokenPattern = /const\s+(\w+)\s*=\s*await\s+openai\.chat\.completions\.create\(\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g;
  if (brokenPattern.test(content)) {
    content = content.replace(
      brokenPattern,
      'const $1 = await openai.chat'
    );
    modified = true;
  }

  // Pattern: const gptRes = await openai.chat.completions.create(\n if (!openai) {...}\n openai.chat
  const gptResPattern = /const\s+gptRes\s*=\s*await\s+openai\.chat\.completions\.create\(\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g;
  if (gptResPattern.test(content)) {
    content = content.replace(
      gptResPattern,
      'const gptRes = await openai.chat'
    );
    modified = true;
  }

  // Pattern: const ethicalRes = await openai.chat.completions.create(\n if (!openai) {...}\n openai.chat
  const ethicalPattern = /const\s+ethicalRes\s*=\s*await\s+openai\.chat\.completions\.create\(\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g;
  if (ethicalPattern.test(content)) {
    content = content.replace(
      ethicalPattern,
      'const ethicalRes = await openai.chat'
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

console.log('Fixing remaining OpenAI syntax issues...');
const fixed = walkDir(API_DIR);
console.log(`Fixed ${fixed} files.`);

const path = require('path');

const API_DIR = path.join(__dirname, '..', 'app', 'api');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern: const ...Res/gpt/ethicalRes/etc = await openai.chat.completions.create(\n if (!openai) {...}\n openai.chat
  const brokenPattern = /const\s+(\w+)\s*=\s*await\s+openai\.chat\.completions\.create\(\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g;
  if (brokenPattern.test(content)) {
    content = content.replace(
      brokenPattern,
      'const $1 = await openai.chat'
    );
    modified = true;
  }

  // Pattern: const gptRes = await openai.chat.completions.create(\n if (!openai) {...}\n openai.chat
  const gptResPattern = /const\s+gptRes\s*=\s*await\s+openai\.chat\.completions\.create\(\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g;
  if (gptResPattern.test(content)) {
    content = content.replace(
      gptResPattern,
      'const gptRes = await openai.chat'
    );
    modified = true;
  }

  // Pattern: const ethicalRes = await openai.chat.completions.create(\n if (!openai) {...}\n openai.chat
  const ethicalPattern = /const\s+ethicalRes\s*=\s*await\s+openai\.chat\.completions\.create\(\s*\n\s*if\s*\(!openai\)[^}]*\}\s*\n\s*openai\.chat/g;
  if (ethicalPattern.test(content)) {
    content = content.replace(
      ethicalPattern,
      'const ethicalRes = await openai.chat'
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

console.log('Fixing remaining OpenAI syntax issues...');
const fixed = walkDir(API_DIR);
console.log(`Fixed ${fixed} files.`);
















