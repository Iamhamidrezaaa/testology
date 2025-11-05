const { readFile, writeFile } = require('fs/promises')
const path = require('path')
const glob = require('glob')

const base = 'E:/Machine Learning/Testology'

async function fixAllIds() {
  // پیدا کردن همه فایل‌های questions در data
  const files = glob.sync(path.join(base, 'data/*-questions.ts'))
  
  for (const file of files) {
    console.log(`Fixing ${path.basename(file)}...`)
    
    let content = await readFile(file, 'utf8')
    
    // تبدیل همه id: number به id: string
    content = content.replace(/id:\s*(\d+)/g, 'id: "$1"')
    
    await writeFile(file, content)
    console.log(`✅ Fixed ${path.basename(file)}`)
  }
  
  console.log('All files fixed!')
}

fixAllIds().catch(console.error)

















