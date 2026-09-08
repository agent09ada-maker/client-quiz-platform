import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { requireEmployee } from "@/lib/session";
import LogoutButton from "@/app/employee/LogoutButton";

const DIFFICULTIES = [
  { key: "EASY", label: "Level 1 · Easy", dots: 1, cls: "lvl-easy" },
  { key: "MEDIUM", label: "Level 2 · Medium", dots: 2, cls: "lvl-medium" },
  { key: "HARD", label: "Level 3 · Hard", dots: 3, cls: "lvl-hard" },
  { key: "EXPERT", label: "Level 4 · Expert", dots: 4, cls: "lvl-expert" },
] as const;

export default async function EmployeeDashboard() {
  const session = await requireEmployee();

  const clients = await db.client.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const recentAttempts = await db.quizAttempt.findMany({
    where: { employeeId: session.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { client: true },
  });

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="topbar-inner">
          <div className="brand-mark">
            <Image src="/logo.png" alt="" width={32} height={32} />
            <span>Client Knowledge Quiz</span>
            <span className="role-tag">Employee</span>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="page">
        <div className="page-head">
          <div>
            <h2>Hi, {session.name}</h2>
            <p>Pick a client and a difficulty level to start a quiz.</p>
          </div>
        </div>

        {clients.length === 0 ? (
          <div className="card empty-state">No clients are set up yet. Check back soon.</div>
        ) : (
          <div className="grid grid-2">
            {clients.map((client) => (
              <div key={client.id} className="card">
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div className="client-avatar">{client.name.charAt(0).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 18, marginBottom: 4 }}>{client.name}</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: 14, minHeight: 36, margin: 0 }}>
                      {client.summary || "No background summary yet."}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                  {DIFFICULTIES.map((d) => (
                    <Link
                      key={d.key}
                      href={`/employee/quiz/${client.id}?difficulty=${d.key}`}
                      className={`level-chip ${d.cls}`}
                    >
                      <span className="level-dots">
                        {[1, 2, 3, 4].map((n) => (
                          <span key={n} className={`level-dot ${n <= d.dots ? "on" : ""}`} />
                        ))}
                      </span>
                      {d.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="page-head" style={{ marginTop: 36 }}>
          <div>
            <h2 style={{ fontSize: 20 }}>Your recent attempts</h2>
          </div>
        </div>
        <div className="card">
          {recentAttempts.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No attempts yet — take your first quiz above.</p>
          ) : (
            <table>
              <thead>
                <tr><th>Client</th><th>Difficulty</th><th>Score</th><th>Date</th></tr>
              </thead>
              <tbody>
                {recentAttempts.map((a) => (
                  <tr key={a.id}>
                    <td>{a.client.name}</td>
                    <td>{a.difficulty}</td>
                    <td>{a.score}/{a.total}</td>
                    <td>{a.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}