import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import AdminShell from "../AdminShell";
import { IconPeople, IconBuilding, IconClipboard } from "@/app/components/icons";

export default async function AdminDashboard() {
  await requireAdmin();

  const [employeeCount, clientCount, pendingCount, attemptCount] = await Promise.all([
    db.employee.count({ where: { active: true } }),
    db.client.count({ where: { active: true } }),
    db.question.count({ where: { status: "PENDING_REVIEW" } }),
    db.quizAttempt.count(),
  ]);

  const recentAttempts = await db.quizAttempt.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { employee: true, client: true },
  });

  return (
    <AdminShell active="/admin/dashboard">
      <div className="page">
        <div className="page-head">
          <div>
            <h2>Overview</h2>
            <p>Snapshot of the whole platform.</p>
          </div>
        </div>

        <div className="grid grid-3">
          <div className="card stat-card">
            <div className="stat-icon"><IconPeople /></div>
            <div>
              <div className="stat-num">{employeeCount}</div>
              <div className="stat-label">Active employees</div>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon"><IconBuilding /></div>
            <div>
              <div className="stat-num">{clientCount}</div>
              <div className="stat-label">Active clients</div>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon"><IconClipboard /></div>
            <div>
              <div className="stat-num">{pendingCount}</div>
              <div className="stat-label">Questions awaiting review</div>
            </div>
          </div>
        </div>

        <div className="page-head" style={{ marginTop: 32 }}>
          <div><h2 style={{ fontSize: 20 }}>Recent quiz activity ({attemptCount} total attempts)</h2></div>
        </div>
        <div className="card">
          {recentAttempts.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No quiz attempts yet.</p>
          ) : (
            <table>
              <thead><tr><th>Employee</th><th>Client</th><th>Difficulty</th><th>Score</th><th>Date</th></tr></thead>
              <tbody>
                {recentAttempts.map((a) => (
                  <tr key={a.id}>
                    <td>{a.employee.name} ({a.employee.employeeId})</td>
                    <td>{a.client.name}</td>
                    <td>{a.difficulty}</td>
                    <td>{a.score}/{a.total}</td>
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
