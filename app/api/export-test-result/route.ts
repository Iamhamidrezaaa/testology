// app/api/export-test-result/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[EXPORT] Raw body:", body);

    // فرمت‌های ورودی که ساپورت می‌کنیم:
    // 1) { testResultId }
    // 2) { testId/testSlug, email یا userId }
    // 3) فرمت قدیمی: { testId, testName, score, analysis, userId }
    const {
      testResultId,
      testId,
      testSlug,
      email,
      userId,
      testName: bodyTestName,
      score: bodyScore,
      analysis: bodyAnalysis,
    } = body as any;

    let testResult: any = null;

    // ۱) اگر testResultId داشتیم → مستقیم همونو می‌گیریم
    if (testResultId) {
      console.log("[EXPORT] Fetch by testResultId:", testResultId);
      testResult = await prisma.testResult.findUnique({
        where: { id: testResultId },
        include: { user: true },
      });
    } else if ((testId || testSlug) && (email || userId)) {
      // ۲) اگر testId + email / userId داریم → آخرین نتیجه‌ی اون تست برای اون یوزر
      console.log("[EXPORT] Fetch by test + user", {
        testId,
        testSlug,
        email,
        userId,
      });

      let user = null;
      if (userId) {
        user = await prisma.user.findUnique({ where: { id: userId } });
      } else if (email) {
        user = await prisma.user.findUnique({ where: { email } });
      }

      if (!user) {
        console.error("[EXPORT] User not found for export");
        return NextResponse.json(
          { error: "کاربر برای خروجی PDF پیدا نشد." },
          { status: 404 }
        );
      }

      testResult = await prisma.testResult.findFirst({
        where: {
          userId: (user as any).id,
          OR: [
            testId ? { testId } : {},
            testSlug ? { testSlug } : {},
          ],
        },
        orderBy: { createdAt: "desc" },
        include: { user: true },
      });
    } else if (testId && (bodyTestName || bodyAnalysis)) {
      // ۳) فرمت قدیمی: فقط با داده‌های بدنه یک نتیجه‌ی موقت می‌سازیم
      console.log("[EXPORT] Using legacy format with provided data");

      testResult = {
        id: `temp-${Date.now()}`,
        testId: testId,
        testSlug: testId,
        testName: bodyTestName || `تست ${testId}`,
        score: typeof bodyScore === "number" ? bodyScore : null,
        interpretation: bodyAnalysis
          ? JSON.stringify([{ title: "تحلیل تست", body: bodyAnalysis }])
          : null,
        createdAt: new Date(),
        userId: userId || null,
        user: userId ? { email: userId } : email ? { email } : null,
      } as any;
    } else {
      console.error("[EXPORT] Missing identifiers");
      return NextResponse.json(
        {
          error:
            "برای خروجی گرفتن PDF باید testResultId یا ترکیبی از testId/testSlug و ایمیل/شناسه کاربر ارسال شود.",
        },
        { status: 400 }
      );
    }

    if (!testResult) {
      console.error("[EXPORT] TestResult not found");
      return NextResponse.json(
        { error: "نتیجه‌ی تست برای خروجی PDF پیدا نشد." },
        { status: 404 }
      );
    }

    console.log("[EXPORT] TestResult loaded:", {
      id: testResult.id,
      testId: testResult.testId,
      testSlug: (testResult as any).testSlug,
      testName: (testResult as any).testName,
      score: testResult.score,
      userId: testResult.userId,
      email: testResult.user?.email,
    });

    // ---------------- PDF GENERATION ----------------

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const resolvedTestName =
      (testResult as any).testName ||
      `نتیجه‌ی تست ${testResult.testId || ""}`;

    const resolvedScore =
      typeof testResult.score === "number" ? testResult.score : null;

    const resolvedEmail =
      testResult.user?.email || email || (userId ?? "") || "";

    const createdAtDate =
      testResult.createdAt instanceof Date
        ? testResult.createdAt
        : new Date(testResult.createdAt ?? Date.now());

    const createdAtText = createdAtDate.toLocaleString("fa-IR");

    // تفسیر را از JSON (اگر شد) درمی‌آریم
    let interpretationBlocks: { title?: string; body: string }[] = [];
    try {
      if (typeof testResult.interpretation === "string") {
        const parsed = JSON.parse(testResult.interpretation);
        if (Array.isArray(parsed)) {
          interpretationBlocks = parsed;
        }
      }
    } catch (e) {
      console.error("[EXPORT] Interpretation parse error:", e);
    }

    const fontSizeTitle = 18;
    const fontSizeText = 12;
    const marginX = 50;
    let y = height - 50;

    // عنوان بالا
    page.drawText("Testology.me", {
      x: marginX,
      y,
      size: 10,
      font,
    });

    y -= 30;

    page.drawText(resolvedTestName, {
      x: marginX,
      y,
      size: fontSizeTitle,
      font,
    });

    y -= 30;

    if (resolvedScore !== null) {
      page.drawText(`امتیاز: ${resolvedScore}`, {
        x: marginX,
        y,
        size: fontSizeText,
        font,
      });
      y -= 20;
    }

    if (resolvedEmail) {
      page.drawText(`ایمیل: ${resolvedEmail}`, {
        x: marginX,
        y,
        size: fontSizeText,
        font,
      });
      y -= 20;
    }

    page.drawText(`تاریخ: ${createdAtText}`, {
      x: marginX,
      y,
      size: fontSizeText,
      font,
    });

    y -= 30;

    const maxWidth = width - marginX * 2;

    const drawParagraph = (text: string) => {
      const words = text.split(" ");
      let line = "";

      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        const lineWidth = font.widthOfTextAtSize(testLine, fontSizeText);

        if (lineWidth > maxWidth) {
          page.drawText(line, {
            x: marginX,
            y,
            size: fontSizeText,
            font,
          });
          y -= 18;
          line = word;
        } else {
          line = testLine;
        }
      }

      if (line) {
        page.drawText(line, {
          x: marginX,
          y,
          size: fontSizeText,
          font,
        });
        y -= 18;
      }
    };

    if (interpretationBlocks.length > 0) {
      for (const block of interpretationBlocks) {
        if (block.title) {
          page.drawText(block.title, {
            x: marginX,
            y,
            size: fontSizeText + 1,
            font,
          });
          y -= 20;
        }

        if (block.body) {
          drawParagraph(block.body);
          y -= 10;
        }
      }
    } else {
      drawParagraph(
        "تحلیل متنی این تست در حال حاضر در دیتابیس ثبت نشده است یا به‌درستی ذخیره نشده."
      );
    }

    const pdfBytes = await pdfDoc.save();

    console.log("[EXPORT] PDF generated, size:", pdfBytes.length);

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="testology-${
          testResult.testSlug || testResult.testId || "result"
        }.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("[EXPORT] Error RAW:", err);
    console.error("[EXPORT] Error message:", err?.message);
    console.error("[EXPORT] Error stack:", err?.stack);

    return NextResponse.json(
      {
        error: "خطا در تولید PDF نتیجه‌ی تست.",
        message: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
