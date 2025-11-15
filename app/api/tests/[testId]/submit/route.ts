/**
 * API Route برای submit کردن تست و دریافت نتیجه کامل
 * POST /api/tests/[testId]/submit
 * 
 * این endpoint:
 * 1. نمره را با scoring-engine-v2 محاسبه می‌کند
 * 2. تفسیر را با interpretation engine می‌سازد
 * 3. نتیجه را در دیتابیس ذخیره می‌کند
 * 4. نتیجه کامل را برمی‌گرداند
 */

import { NextRequest, NextResponse } from "next/server";
import { scoreTest, scoreTestWithDebug } from "@/lib/scoring-engine-v2";
import { buildInterpretation } from "@/lib/interpretation";
import { prisma } from "@/lib/prisma";
import { getTestQuestions } from "@/app/data/test-questions";

export async function POST(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    let { testId } = params;

    if (!testId) {
      return NextResponse.json(
        { error: "testId الزامی است" },
        { status: 400 }
      );
    }

    // بررسی مود debug از query string
    const url = new URL(req.url);
    const debug = url.searchParams.get("debug") === "1";

    // تبدیل testId به فرمت مورد نیاز config (مثلاً mbti -> MBTI)
    const testIdMapping: Record<string, string> = {
      "mbti": "MBTI",
      "gad7": "GAD7",
      "phq9": "PHQ9",
      "riasec": "RIASEC",
      "attachment": "Attachment",
      "learning-style": "LearningStyle",
      "rosenberg": "Rosenberg",
      "swls": "SWLS",
      "panas": "PANAS",
      "eq": "EQ",
      "focus": "FocusAttention",
      "creativity": "Creativity",
      "neo-ffi": "NEOFFI",
      "bfi": "BFI",
    };
    
    // اگر mapping وجود دارد، استفاده کن، در غیر این صورت اول حرف را uppercase کن
    const normalizedTestId = testIdMapping[testId.toLowerCase()] || 
      testId.charAt(0).toUpperCase() + testId.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase());

    const body = await req.json();
    const { answers, userId, email } = body as {
      answers: { questionId: number; value: number }[];
      userId?: string | null;
      email?: string | null;
    };

    console.log(`📥 Received userId: ${userId || "null/undefined"}`);
    console.log(`📥 Received email: ${email || "null/undefined"}`);
    console.log(`📥 Received answers count: ${answers.length}`);
    if (debug) {
      console.log(`🔍 [DEBUG MODE] Debug mode enabled for test: ${normalizedTestId}`);
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "answers الزامی است و باید آرایه باشد" },
        { status: 400 }
      );
    }

    // 1) محاسبه نمره (با یا بدون debug)
    let scoredResult;
    let debugInfo = null;

    if (debug) {
      // دریافت متن سوالات برای نمایش در debug
      const questions = getTestQuestions(testId);
      const questionTexts: Record<number, string> = {};
      questions.forEach((q) => {
        const qId = parseInt(q.id);
        if (!isNaN(qId)) {
          questionTexts[qId] = q.text;
        }
      });

      const { result, debug: debugData } = scoreTestWithDebug(
        normalizedTestId,
        answers,
        questionTexts
      );
      scoredResult = result;
      debugInfo = debugData;

      // لاگ debug در console
      console.log("[DEBUG] Scoring details:", JSON.stringify(debugData, null, 2));
    } else {
      scoredResult = scoreTest(normalizedTestId, answers);
    }

    // 2) ساخت تفسیر (فقط برای این تست)
    const interpretation = buildInterpretation([scoredResult]);

    // 3) ذخیره در دیتابیس - راه‌حل عملی: upsert کاربر بر اساس email
    let savedResult = null;
    console.log(`🔍 Checking userId: ${userId || "null"}, email: ${email || "null"}, prisma exists: ${!!prisma}`);
    
    if (prisma) {
      try {
        let finalUserId = userId;
        
        // راه‌حل عملی: اگر userId نداریم اما email داریم، کاربر را upsert کن
        if (!finalUserId && email) {
          console.log(`💡 No userId provided, but email exists. Upserting user with email: ${email}`);
          try {
            const user = await prisma.user.upsert({
              where: { email: email },
              update: {
                // اگر کاربر وجود داشت، فقط به‌روزرسانی کن
                isActive: true,
              },
              create: {
                email: email,
                name: email.split("@")[0], // استفاده از قسمت قبل از @ به عنوان نام
                role: "USER",
                isActive: true,
              },
              select: { id: true },
            });
            finalUserId = user.id;
            console.log(`✅ User upserted with id: ${finalUserId}`);
          } catch (upsertError: any) {
            console.error(`❌ Failed to upsert user: ${upsertError.message}`);
            // اگر upsert ناموفق بود، سعی کن پیدا کن
            const existingUser = await prisma.user.findUnique({
              where: { email: email },
              select: { id: true },
            });
            if (existingUser) {
              finalUserId = existingUser.id;
              console.log(`✅ User found after failed upsert with id: ${finalUserId}`);
            } else {
              console.warn(`⚠️ Could not find or create user with email: ${email}`);
            }
          }
        }
        
        // اگر userId به صورت email است، کاربر را پیدا کن و id واقعی را بگیر
        if (finalUserId && finalUserId.includes("@")) {
          console.log(`🔍 userId is email, looking for user: ${finalUserId}`);
          const user = await prisma.user.findUnique({
            where: { email: finalUserId },
            select: { id: true },
          });
          if (user) {
            finalUserId = user.id;
            console.log(`✅ User found with id: ${finalUserId}`);
          } else {
            console.warn(`❌ User not found with email: ${finalUserId}, attempting upsert...`);
            // سعی کن upsert کن
            try {
              const newUser = await prisma.user.upsert({
                where: { email: finalUserId },
                update: {},
                create: {
                  email: finalUserId,
                  name: finalUserId.split("@")[0],
                  role: "USER",
                  isActive: true,
                },
                select: { id: true },
              });
              finalUserId = newUser.id;
              console.log(`✅ User upserted with id: ${finalUserId}`);
            } catch (createError: any) {
              console.error(`❌ Failed to upsert user: ${createError.message}`);
              finalUserId = null as any;
            }
          }
        } else if (finalUserId && !finalUserId.includes("@")) {
          console.log(`📝 Using userId directly: ${finalUserId}`);
        }

        if (finalUserId) {
          console.log(`💾 Attempting to save test result with userId: ${finalUserId}`);
          savedResult = await prisma.testResult.create({
            data: {
              userId: finalUserId,
              testName: scoredResult.title,
              testId: scoredResult.testId,
              testSlug: testId,
              score: scoredResult.totalScore,
              result: scoredResult.totalLevelLabel || null,
              resultText: scoredResult.interpretation || null,
              rawAnswers: JSON.stringify(scoredResult.rawAnswers),
              answers: JSON.stringify(scoredResult.rawAnswers),
              severity: scoredResult.totalLevelId || null,
              interpretation: JSON.stringify(interpretation.chunks),
              // ذخیره subscales برای استفاده در Global Recommendations
              subscales: JSON.stringify(scoredResult.subscales),
              completed: true,
            },
          });
          console.log(`✅ Test result saved successfully with id: ${savedResult.id}`);
        } else {
          console.warn(`⚠️ finalUserId is null, skipping save`);
        }
      } catch (dbError: any) {
        console.error("❌ Could not save to database:", dbError);
        console.error("Error details:", dbError.message);
        console.error("Stack trace:", dbError.stack);
        // ادامه می‌دهیم حتی اگر ذخیره نشد
        savedResult = null; // مطمئن شو که null است
      }
    } else {
      console.warn(`⚠️ Cannot save: userId=${userId || "null"}, email=${email || "null"}, prisma=${!!prisma}`);
      savedResult = null; // مطمئن شو که null است
    }

    // 4) برگرداندن نتیجه کامل - همیشه saved را برگردان
    const response: any = {
      success: true,
      saved: !!savedResult, // همیشه true یا false (نه undefined)
      result: {
        ...scoredResult,
        interpretation: interpretation.chunks,
        interpretationSummary: interpretation.summary,
      },
    };

    // اگر debug mode فعال است، debug info را اضافه کن
    if (debug && debugInfo) {
      response.debug = debugInfo;
    }

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Error in test submit API:", err);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در پردازش تست",
        details: err.message,
        saved: false, // در صورت خطا، ذخیره نشده
      },
      { status: 500 }
    );
  }
}

