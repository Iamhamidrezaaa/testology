import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET method to fetch a single test with its questions and options
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // موقتاً authentication را غیرفعال می‌کنیم
    console.log('🚀 Fetching single test (authentication temporarily disabled)')

    const testId = params.id

    // Use Prisma ORM to fetch test with questions and options
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          include: {
            options: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!test) {
      return NextResponse.json({ error: 'تست یافت نشد' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: test })
  } catch (error) {
    console.error('Error fetching single test:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت تست' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // موقتاً authentication را غیرفعال می‌کنیم
    console.log('🚀 Updating test (authentication temporarily disabled)')

    const testId = params.id
    const { testName, description, category, isActive, questions } = await req.json()

    // Update test details using raw SQL
    await prisma.$executeRaw`
      UPDATE Test 
      SET testName = ${testName}, 
          description = ${description}, 
          category = ${category}, 
          isActive = ${isActive},
          updatedAt = datetime('now')
      WHERE id = ${testId}
    `

    // Handle questions and options
    if (questions && Array.isArray(questions)) {
      for (const questionData of questions) {
        if (questionData.id && questionData.isDeleted) {
          // Delete question using raw SQL
          await prisma.$executeRaw`DELETE FROM Question WHERE id = ${questionData.id}`
        } else if (questionData.id) {
          // Update existing question using raw SQL
          await prisma.$executeRaw`
            UPDATE Question 
            SET text = ${questionData.text}, 
                order = ${questionData.order},
                updatedAt = datetime('now')
            WHERE id = ${questionData.id}
          `
          
          const updatedQuestion = { id: questionData.id }

          // Handle options for existing question
          if (questionData.options && Array.isArray(questionData.options)) {
            for (const optionData of questionData.options) {
              if (optionData.id && optionData.isDeleted) {
                // Delete option
                await prisma.$executeRaw`DELETE FROM Option WHERE id = ${optionData.id}`
              } else if (optionData.id) {
                // Update existing option
                await prisma.$executeRaw`UPDATE Option SET text = ${optionData.text}, isCorrect = ${optionData.isCorrect}, score = ${optionData.score}, order = ${optionData.order} WHERE id = ${optionData.id}`
              } else {
                // Create new option
                await prisma.$executeRaw`INSERT INTO Option (id, questionId, text, isCorrect, score, order, createdAt, updatedAt) VALUES (${crypto.randomUUID()}, ${updatedQuestion.id}, ${optionData.text}, ${optionData.isCorrect}, ${optionData.score}, ${optionData.order}, datetime('now'), datetime('now'))`
              }
            }
          }
        } else {
          // Create new question using raw SQL
          const newQuestionId = crypto.randomUUID()
          await prisma.$executeRaw`
            INSERT INTO Question (id, testId, text, order, createdAt, updatedAt)
            VALUES (${newQuestionId}, ${testId}, ${questionData.text}, ${questionData.order}, datetime('now'), datetime('now'))
          `
          
          const newQuestion = { id: newQuestionId }

          // Create options for new question
          if (questionData.options && Array.isArray(questionData.options)) {
            for (const optionData of questionData.options) {
              await prisma.$executeRaw`INSERT INTO Option (id, questionId, text, isCorrect, score, order, createdAt, updatedAt) VALUES (${crypto.randomUUID()}, ${newQuestion.id}, ${optionData.text}, ${optionData.isCorrect}, ${optionData.score}, ${optionData.order}, datetime('now'), datetime('now'))`
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تست با موفقیت به‌روزرسانی شد',
      data: { id: testId, testName, description, category, isActive },
    })
  } catch (error) {
    console.error('Error updating test:', error)
    return NextResponse.json(
      { error: 'خطا در به‌روزرسانی تست' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // موقتاً authentication را غیرفعال می‌کنیم
    console.log('🚀 Moving test to trash (authentication temporarily disabled)')
    
    const testId = params.id
    
    // Move test to trash (soft delete) using raw SQL
    await prisma.$executeRaw`
      UPDATE Test 
      SET isActive = false,
          deletedAt = datetime('now'),
          updatedAt = datetime('now')
      WHERE id = ${testId}
    `
    
    return NextResponse.json({
      success: true,
      message: 'تست به سطل زباله منتقل شد'
    })

  } catch (error) {
    console.error('Error moving test to trash:', error)
    return NextResponse.json(
      { error: 'خطا در انتقال تست به سطل زباله' },
      { status: 500 }
    )
  }
}
