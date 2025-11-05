const fs = require('fs');
const path = require('path');

// Function to fix auth imports in a file
function fixAuthImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    let newContent = content;
    
    // Fix different patterns
    newContent = newContent.replace(
      /from ['"]@\/pages\/api\/auth\/\[\.\.\.nextauth\]/g,
      "from '@/app/api/auth/[...nextauth]/route'"
    );
    
    newContent = newContent.replace(
      /from ['"]\.\.\/auth\/\[\.\.\.nextauth\]/g,
      "from '@/app/api/auth/[...nextauth]/route'"
    );
    
    newContent = newContent.replace(
      /from ['"]\.\.\/\.\.\/auth\/\[\.\.\.nextauth\]/g,
      "from '@/app/api/auth/[...nextauth]/route'"
    );
    
    newContent = newContent.replace(
      /from ['"]\.\.\/\.\.\/\.\.\/auth\/\[\.\.\.nextauth\]/g,
      "from '@/app/api/auth/[...nextauth]/route'"
    );
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed auth imports in ${filePath}`);
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
      fixAuthImports(fullPath);
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




























