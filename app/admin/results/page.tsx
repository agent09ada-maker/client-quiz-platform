import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import AdminShell from "../AdminShell";

export default async function ResultsPage({ searchParams }: { searchParams: { clientId?: string } }) {
  await requireAdmin();

  const clients = await db.client.findMany({ orderBy: { name: "asc" } });

  const attempts = await db.quizAttempt.findMany({
    where: searchParams.clientId ? { clientId: searchParams.clientId } : {},
    include: { employee: true, client: true },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  return (
    <AdminShell active="/admin/results">
      <div className="page">
        <div className="page-head">
          <div>
            <h2>Results</h2>
            <p>Every quiz attempt across the company (latest 300 shown).</p>
          </div>
        </div>

        <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href="/admin/results" className={`btn ${!searchParams.clientId ? "btn-primary" : ""}`} style={{ width: "auto", padding: "7px 14px", fontSize: 13, textDecoration: "none" }}>
            All clients
          </a>
          {clients.map((c) => (
            <a
              key={c.id}
              href={`/admin/results?clientId=${c.id}`}
              className={`btn ${searchParams.clientId === c.id ? "btn-primary" : ""}`}
              style={{ width: "auto", padding: "7px 14px", fontSize: 13, textDecoration: "none" }}
            >
              {c.name}
            </a>
          ))}
        </div>

        <div className="card">
          {attempts.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No results yet.</p>
          ) : (
            <table>
              <thead>
                <tr><th>Employee</th><th>Client</th><th>Difficulty</th><th>Score</th><th>%</th><th>Date</th></tr>
              </thead>
              <tbody>
                {attempts.map((a) => (
                  <tr key={a.id}>
                    <td>{a.employee.name} ({a.employee.employeeId})</td>
                    <td>{a.client.name}</td>
                    <td>{a.difficulty}</td>
                    <td>{a.score}/{a.total}</td>
                    <td>{Math.round((a.score / a.total) * 100)}%</td>
                    <td>{a.createdAt.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
