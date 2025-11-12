const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, '..', 'app', 'api');

function fixOpenAIImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Check if file uses OpenAI at module level
  const hasModuleLevelOpenAI = /^const\s+(openai|client)\s*=\s*new\s+OpenAI\(/m.test(content);
  
  if (!hasModuleLevelOpenAI) {
    return false;
  }

  // Skip if already using getOpenAIClient
  if (content.includes('getOpenAIClient')) {
    return false;
  }

  // Replace import
  if (content.includes("import OpenAI from 'openai'") || content.includes('import OpenAI from "openai"')) {
    content = content.replace(
      /import\s+OpenAI\s+from\s+['"]openai['"];?\n?/,
      "import { getOpenAIClient } from '@/lib/openai-client';\n"
    );
    modified = true;
  }

  // Replace module-level initialization
  const openaiVarMatch = content.match(/^const\s+((?:openai|client))\s*=\s*new\s+OpenAI\(/m);
  if (openaiVarMatch) {
    const varName = openaiVarMatch[1];
    // Remove the module-level initialization
    content = content.replace(
      /^const\s+(?:openai|client)\s*=\s*new\s+OpenAI\([^)]*\);?\n?/m,
      ''
    );
    
    // Find all usages and add null check before first usage
    const usageRegex = new RegExp(`\\b${varName}\\.`, 'g');
    if (usageRegex.test(content)) {
      // Find the function that contains the first usage
      const functionMatch = content.match(/(export\s+(?:async\s+)?function\s+\w+[^{]*\{[^}]*)/);
      if (functionMatch) {
        const funcStart = functionMatch.index;
        const funcBody = content.substring(funcStart);
        const firstUsage = funcBody.search(new RegExp(`\\b${varName}\\.`));
        
        if (firstUsage !== -1) {
          // Insert null check before first usage
          const insertPos = funcStart + firstUsage;
          const beforeUsage = content.substring(0, insertPos);
          const afterUsage = content.substring(insertPos);
          
          // Find the line start
          const lineStart = beforeUsage.lastIndexOf('\n') + 1;
          const indent = beforeUsage.substring(lineStart).match(/^\s*/)[0];
          
          const nullCheck = `\n${indent}const ${varName} = getOpenAIClient();\n${indent}if (!${varName}) {\n${indent}  return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n${indent}}\n`;
          
          content = beforeUsage + nullCheck + afterUsage;
          modified = true;
        }
      }
    }
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
      if (fixOpenAIImports(filePath)) {
        count++;
      }
    }
  }

  return count;
}

console.log('Fixing OpenAI imports in API routes...');
const fixed = walkDir(API_DIR);
console.log(`Fixed ${fixed} files.`);

const path = require('path');

const API_DIR = path.join(__dirname, '..', 'app', 'api');

function fixOpenAIImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Check if file uses OpenAI at module level
  const hasModuleLevelOpenAI = /^const\s+(openai|client)\s*=\s*new\s+OpenAI\(/m.test(content);
  
  if (!hasModuleLevelOpenAI) {
    return false;
  }

  // Skip if already using getOpenAIClient
  if (content.includes('getOpenAIClient')) {
    return false;
  }

  // Replace import
  if (content.includes("import OpenAI from 'openai'") || content.includes('import OpenAI from "openai"')) {
    content = content.replace(
      /import\s+OpenAI\s+from\s+['"]openai['"];?\n?/,
      "import { getOpenAIClient } from '@/lib/openai-client';\n"
    );
    modified = true;
  }

  // Replace module-level initialization
  const openaiVarMatch = content.match(/^const\s+((?:openai|client))\s*=\s*new\s+OpenAI\(/m);
  if (openaiVarMatch) {
    const varName = openaiVarMatch[1];
    // Remove the module-level initialization
    content = content.replace(
      /^const\s+(?:openai|client)\s*=\s*new\s+OpenAI\([^)]*\);?\n?/m,
      ''
    );
    
    // Find all usages and add null check before first usage
    const usageRegex = new RegExp(`\\b${varName}\\.`, 'g');
    if (usageRegex.test(content)) {
      // Find the function that contains the first usage
      const functionMatch = content.match(/(export\s+(?:async\s+)?function\s+\w+[^{]*\{[^}]*)/);
      if (functionMatch) {
        const funcStart = functionMatch.index;
        const funcBody = content.substring(funcStart);
        const firstUsage = funcBody.search(new RegExp(`\\b${varName}\\.`));
        
        if (firstUsage !== -1) {
          // Insert null check before first usage
          const insertPos = funcStart + firstUsage;
          const beforeUsage = content.substring(0, insertPos);
          const afterUsage = content.substring(insertPos);
          
          // Find the line start
          const lineStart = beforeUsage.lastIndexOf('\n') + 1;
          const indent = beforeUsage.substring(lineStart).match(/^\s*/)[0];
          
          const nullCheck = `\n${indent}const ${varName} = getOpenAIClient();\n${indent}if (!${varName}) {\n${indent}  return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n${indent}}\n`;
          
          content = beforeUsage + nullCheck + afterUsage;
          modified = true;
        }
      }
    }
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
      if (fixOpenAIImports(filePath)) {
        count++;
      }
    }
  }

  return count;
}

console.log('Fixing OpenAI imports in API routes...');
const fixed = walkDir(API_DIR);
console.log(`Fixed ${fixed} files.`);

const path = require('path');

const API_DIR = path.join(__dirname, '..', 'app', 'api');

function fixOpenAIImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Check if file uses OpenAI at module level
  const hasModuleLevelOpenAI = /^const\s+(openai|client)\s*=\s*new\s+OpenAI\(/m.test(content);
  
  if (!hasModuleLevelOpenAI) {
    return false;
  }

  // Skip if already using getOpenAIClient
  if (content.includes('getOpenAIClient')) {
    return false;
  }

  // Replace import
  if (content.includes("import OpenAI from 'openai'") || content.includes('import OpenAI from "openai"')) {
    content = content.replace(
      /import\s+OpenAI\s+from\s+['"]openai['"];?\n?/,
      "import { getOpenAIClient } from '@/lib/openai-client';\n"
    );
    modified = true;
  }

  // Replace module-level initialization
  const openaiVarMatch = content.match(/^const\s+((?:openai|client))\s*=\s*new\s+OpenAI\(/m);
  if (openaiVarMatch) {
    const varName = openaiVarMatch[1];
    // Remove the module-level initialization
    content = content.replace(
      /^const\s+(?:openai|client)\s*=\s*new\s+OpenAI\([^)]*\);?\n?/m,
      ''
    );
    
    // Find all usages and add null check before first usage
    const usageRegex = new RegExp(`\\b${varName}\\.`, 'g');
    if (usageRegex.test(content)) {
      // Find the function that contains the first usage
      const functionMatch = content.match(/(export\s+(?:async\s+)?function\s+\w+[^{]*\{[^}]*)/);
      if (functionMatch) {
        const funcStart = functionMatch.index;
        const funcBody = content.substring(funcStart);
        const firstUsage = funcBody.search(new RegExp(`\\b${varName}\\.`));
        
        if (firstUsage !== -1) {
          // Insert null check before first usage
          const insertPos = funcStart + firstUsage;
          const beforeUsage = content.substring(0, insertPos);
          const afterUsage = content.substring(insertPos);
          
          // Find the line start
          const lineStart = beforeUsage.lastIndexOf('\n') + 1;
          const indent = beforeUsage.substring(lineStart).match(/^\s*/)[0];
          
          const nullCheck = `\n${indent}const ${varName} = getOpenAIClient();\n${indent}if (!${varName}) {\n${indent}  return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });\n${indent}}\n`;
          
          content = beforeUsage + nullCheck + afterUsage;
          modified = true;
        }
      }
    }
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
      if (fixOpenAIImports(filePath)) {
        count++;
      }
    }
  }

  return count;
}

console.log('Fixing OpenAI imports in API routes...');
const fixed = walkDir(API_DIR);
console.log(`Fixed ${fixed} files.`);
















