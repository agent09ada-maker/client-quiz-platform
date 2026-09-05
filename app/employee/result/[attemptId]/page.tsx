import Link from "next/link";
import { db } from "@/lib/db";
import { requireEmployee } from "@/lib/session";
import { IconTrophy, IconTarget } from "@/app/components/icons";

type GradedAnswer = { questionId: string; selectedIndex: number; correct: boolean };

export default async function ResultPage({ params }: { params: { attemptId: string } }) {
  const session = await requireEmployee();

  const attempt = await db.quizAttempt.findUnique({
    where: { id: params.attemptId },
    include: { client: true },
  });

  if (!attempt || attempt.employeeId !== session.id) {
    return (
      <div className="page">
        <div className="card empty-state">Result not found.</div>
      </div>
    );
  }

  const pct = Math.round((attempt.score / attempt.total) * 100);
  const doneWell = pct >= 70;

  const gradedAnswers: GradedAnswer[] = JSON.parse(attempt.answers);
  const questions = await db.question.findMany({
    where: { id: { in: gradedAnswers.map((a) => a.questionId) } },
  });
  const questionById = new Map(questions.map((q) => [q.id, q]));

  return (
    <div className="auth-screen" style={{ alignItems: "flex-start", paddingTop: 48 }}>
      <div className="auth-glow one" />
      <div className="auth-glow two" />
      <div className="auth-card" style={{ maxWidth: 640, textAlign: "center", zIndex: 1 }}>
        <div className="logo-row">{doneWell ? <IconTrophy /> : <IconTarget />}</div>
        <p className="sub" style={{ marginBottom: 4 }}>{attempt.client.name} · {attempt.difficulty}</p>
        <h1 style={{ fontSize: 44 }}>{pct}%</h1>
        <p className="sub">
          {doneWell
            ? `Nice work — ${attempt.score} out of ${attempt.total} correct.`
            : `You got ${attempt.score} out of ${attempt.total} correct. Review below to see what to brush up on.`}
        </p>

        <div style={{ textAlign: "left", marginTop: 24 }}>
          {gradedAnswers.map((a, i) => {
            const q = questionById.get(a.questionId);
            if (!q) return null;
            const options: string[] = JSON.parse(q.options);
            return (
              <div key={a.questionId} className="card" style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
                  {i + 1}. {q.prompt}
                </p>
                {options.map((opt, optIndex) => {
                  const isCorrectAnswer = optIndex === q.correctIndex;
                  const isYourWrongPick = optIndex === a.selectedIndex && !a.correct;
                  const cls = isCorrectAnswer
                    ? "review-option correct-answer"
                    : isYourWrongPick
                    ? "review-option wrong-selected"
                    : "review-option";
                  return (
                    <div key={optIndex} className={cls}>
                      <span>{opt}</span>
                      {isCorrectAnswer && <span className="review-tag correct">Correct answer</span>}
                      {isYourWrongPick && <span className="review-tag your-answer">Your answer</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
          <Link href="/employee/dashboard" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}