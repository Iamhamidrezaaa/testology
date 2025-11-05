const fs = require('fs');
const path = require('path');

// Function to add 'use client' to a file
function addUseClient(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file already has 'use client'
    if (content.includes("'use client'") || content.includes('"use client"')) {
      console.log(`✅ ${filePath} already has 'use client'`);
      return;
    }
    
    // Check if file uses React hooks
    if (content.includes('useState') || content.includes('useEffect') || content.includes('useRouter')) {
      // Add 'use client' at the top
      const newContent = "'use client'\n\n" + content;
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Added 'use client' to ${filePath}`);
    } else {
      console.log(`⏭️  ${filePath} doesn't need 'use client'`);
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
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      addUseClient(fullPath);
    }
  }
}

// Process components/admin directory
const adminDir = path.join(__dirname, 'components', 'admin');
if (fs.existsSync(adminDir)) {
  console.log('🔧 Processing components/admin directory...');
  processDirectory(adminDir);
  console.log('✅ Done processing components/admin');
} else {
  console.log('❌ components/admin directory not found');
}

