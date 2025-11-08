import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const base = 'E:/Machine Learning/Testology'

const tests = [
  'swls', 'rosenberg', 'pss', 'asrs', 'spin', 'attachment', 'cope', 'gse', 'isi', 'ucla',
  'psss', 'scs', 'tas', 'hads', 'ders', 'panas', 'scs-y', 'maas', 'rsei', 'cdrisc', 'psqi', 'focus'
]

async function generateTest(slug: string) {
  const pascal = slug
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')

  const questionContent = `export const ${slug}Questions = [
  {
    question: "Sample question 1",
    options: ["Not at all", "Several days", "More than half", "Nearly every day"]
  },
  {
    question: "Sample question 2",
    options: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]
  }
];
export default ${slug}Questions;
`

  const testPageContent = `import AnimatedTest from "@/components/layout/AnimatedTest";
import ${slug}Questions from "@/data/${slug}-questions";

export const metadata = { title: "تست ${slug}" };

export default function ${pascal}TestPage() {
  return <AnimatedTest test="test-${slug}" questions={${slug}Questions} />;
}
`

  const apiContent = `import { NextRequest, NextResponse } from "next/server";
import { analyzeTestWithGPT } from "@/lib/services/gpt";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const analysis = await analyzeTestWithGPT("${slug}", body.answers);
  const result = await prisma.testResult.create({
    data: {
      testSlug: "${slug}",
      answers: body.answers,
      userId: body.userId || null,
      result: analysis,
    },
  });
  return NextResponse.json(result);
}
`

  await mkdir(path.join(base, 'data'), { recursive: true });
  await mkdir(path.join(base, 'pages/tests'), { recursive: true });
  await mkdir(path.join(base, 'pages/api'), { recursive: true });

  await writeFile(path.join(base, `data/${slug}-questions.ts`), questionContent);
  await writeFile(path.join(base, `pages/tests/${slug}.tsx`), testPageContent);
  await writeFile(path.join(base, `pages/api/analyze-${slug}.ts`), apiContent);
}

async function run() {
  for (const slug of tests) {
    await generateTest(slug);
    console.log(`✅ ${slug} created`);
  }
}

run();




















