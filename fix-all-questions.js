const fs = require('fs')
const path = require('path')

const dataDir = 'data'

// لیست فایل‌های questions
const files = [
  'asrs-questions.ts',
  'attachment-questions.ts', 
  'bai-questions.ts',
  'cd-risc-questions.ts',
  'cope-questions.ts',
  'ders-questions.ts',
  'emotion-regulation-questions.ts',
  'gad7-questions.ts',
  'mbti-questions.ts',
  'phq9-questions.ts',
  'psqi-questions.ts',
  'pss-questions.ts',
  'scs-questions.ts'
]

files.forEach(file => {
  const filePath = path.join(dataDir, file)
  
  if (fs.existsSync(filePath)) {
    console.log(`Fixing ${file}...`)
    
    let content = fs.readFileSync(filePath, 'utf8')
    
    // حذف import Question
    content = content.replace(/import { Question } from '\.\.\/types\/test'\n\n/, '')
    
    // تبدیل type annotation
    content = content.replace(/: Question\[\] = \[/, ' = [')
    
    // تبدیل همه id: number به id: string
    content = content.replace(/id:\s*(\d+)/g, 'id: "$1"')
    
    fs.writeFileSync(filePath, content)
    console.log(`✅ Fixed ${file}`)
  } else {
    console.log(`❌ File not found: ${file}`)
  }
})

console.log('All files fixed!')

















