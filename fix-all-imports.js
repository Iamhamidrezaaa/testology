const fs = require('fs');
const path = require('path');

// Function to fix all import issues in a file
function fixImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Fix auth imports
    const authPatterns = [
      [/from ['"]@\/pages\/api\/auth\/\[\.\.\.nextauth\]/g, "from '@/app/api/auth/[...nextauth]/route'"],
      [/from ['"]\.\.\/auth\/\[\.\.\.nextauth\]/g, "from '@/app/api/auth/[...nextauth]/route'"],
      [/from ['"]\.\.\/\.\.\/auth\/\[\.\.\.nextauth\]/g, "from '@/app/api/auth/[...nextauth]/route'"],
      [/from ['"]\.\.\/\.\.\/\.\.\/auth\/\[\.\.\.nextauth\]/g, "from '@/app/api/auth/[...nextauth]/route'"],
      [/from ['"]\.\/auth\/\[\.\.\.nextauth\]/g, "from '@/app/api/auth/[...nextauth]/route'"]
    ];
    
    authPatterns.forEach(([pattern, replacement]) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        changed = true;
      }
    });
    
    // Fix double quotes
    content = content.replace(/route''/g, "route'");
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed imports in ${filePath}`);
    } else {
      console.log(`⏭️  ${filePath} doesn't need fixing`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Function to recursively find and process files
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      fixImports(fullPath);
    }
  }
}

// Process pages/api directory
const apiDir = path.join(__dirname, 'pages', 'api');
if (fs.existsSync(apiDir)) {
  console.log('🔧 Processing pages/api directory...');
  processDirectory(apiDir);
  console.log('✅ Done processing pages/api');
} else {
  console.log('❌ pages/api directory not found');
}




























