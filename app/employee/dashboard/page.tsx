import Link from "next/link";
import { db } from "@/lib/db";
import { requireEmployee } from "@/lib/session";
import LogoutButton from "@/app/employee/LogoutButton";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD", "EXPERT"] as const;

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
          <h1>Client Knowledge Quiz <span className="role-tag">Employee</span></h1>
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
                <h3 style={{ fontSize: 18, marginBottom: 6 }}>{client.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, minHeight: 36 }}>
                  {client.summary || "No background summary yet."}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                  {DIFFICULTIES.map((d) => (
                    <Link
                      key={d}
                      href={`/employee/quiz/${client.id}?difficulty=${d}`}
                      className="btn"
                      style={{ textDecoration: "none", fontSize: 13, padding: "7px 12px" }}
                    >
                      {d[0] + d.slice(1).toLowerCase()}
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
