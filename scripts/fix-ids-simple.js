const { readFile, writeFile } = require('fs/promises')
const path = require('path')
const { glob } = require('glob')

async function fixAllIds() {
  const files = await glob('data/*-questions.ts')
  
  for (const file of files) {
    console.log(`Fixing ${file}...`)
    
    let content = await readFile(file, 'utf8')
    
    // تبدیل همه id: number به id: string
    content = content.replace(/id:\s*(\d+)/g, 'id: "$1"')
    
    await writeFile(file, content)
    console.log(`✅ Fixed ${file}`)
  }
  
  console.log('All files fixed!')
}

fixAllIds().catch(console.error)

















