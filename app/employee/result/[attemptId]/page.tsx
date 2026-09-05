import Link from "next/link";
import { db } from "@/lib/db";
import { requireEmployee } from "@/lib/session";

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

  return (
    <div className="auth-screen">
      <div className="auth-card" style={{ maxWidth: 440, textAlign: "center" }}>
        <p className="sub" style={{ marginBottom: 4 }}>{attempt.client.name} · {attempt.difficulty}</p>
        <h1 style={{ fontSize: 44 }}>{pct}%</h1>
        <p className="sub">You got {attempt.score} out of {attempt.total} correct.</p>
        <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
          <Link href="/employee/dashboard" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
