import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireEmployee } from "@/lib/session";

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requireEmployee();
  } catch {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { clientId, difficulty, answers } = await req.json() as {
    clientId: string;
    difficulty: string;
    answers: { questionId: string; selectedIndex: number }[];
  };

  const questionIds = answers.map((a) => a.questionId);
  const questions = await db.question.findMany({ where: { id: { in: questionIds } } });
  const byId = new Map(questions.map((q) => [q.id, q]));

  let score = 0;
  const gradedAnswers = answers.map((a) => {
    const q = byId.get(a.questionId);
    const correct = q ? a.selectedIndex === q.correctIndex : false;
    if (correct) score += 1;
    return { ...a, correct };
  });

  const attempt = await db.quizAttempt.create({
    data: {
      employeeId: session.id,
      clientId,
      difficulty: difficulty as any,
      score,
      total: answers.length,
      answers: JSON.stringify(gradedAnswers),
    },
  });

  return NextResponse.json({ attemptId: attempt.id, score, total: answers.length });
}
