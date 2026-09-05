"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type EmployeeRow = { id: string; employeeId: string; name: string; active: boolean; createdAt: string };

export default function EmployeesManager({ initialEmployees }: { initialEmployees: EmployeeRow[] }) {
  const router = useRouter();
  const [bulkText, setBulkText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ employeeId: string; pin: string }[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function submitBulk(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setResult(null);

    const rows = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [employeeId, name] = line.split(",").map((p) => p.trim());
        return { employeeId, name: name || employeeId };
      });

    const res = await fetch("/api/admin/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employees: rows }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);

    if (res.ok) {
      setResult(data.created);
      setBulkText("");
      router.refresh();
    } else {
      setError(data.error || "Something went wrong.");
    }
  }

  async function resetPin(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/admin/employees/${id}`, { method: "PATCH", body: JSON.stringify({ action: "reset-pin" }) });
    const data = await res.json().catch(() => ({}));
    setBusyId(null);
    if (res.ok) alert(`New PIN: ${data.pin}`);
  }

  async function toggleActive(id: string, active: boolean) {
    setBusyId(id);
    await fetch(`/api/admin/employees/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ action: "set-active", active: !active }),
    });
    setBusyId(null);
    router.refresh();
  }

  return (
    <>
      <div className="card">
        <h3 style={{ fontSize: 16, marginBottom: 6 }}>Add employees</h3>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 12 }}>
          One per line: <code>employeeId, full name</code>. PINs are generated automatically and shown once below —
          share them securely (e.g. printed slips or individual messages), then employees sign in at{" "}
          <code>/employee/login</code>.
        </p>
        <form onSubmit={submitBulk}>
          <div className="field">
            <textarea
              rows={6}
              placeholder={"EMP0001, Aditi Sharma\nEMP0002, Rohan Verma\nEMP0003, Priya Nair"}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary" style={{ width: "auto", padding: "10px 20px" }} disabled={submitting}>
            {submitting ? "Adding…" : "Add employees"}
          </button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </div>

      {result && (
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 10 }}>New PINs — copy these now, they won't be shown again</h3>
          <table>
            <thead><tr><th>Employee ID</th><th>PIN</th></tr></thead>
            <tbody>
              {result.map((r) => (
                <tr key={r.employeeId}><td>{r.employeeId}</td><td>{r.pin}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card">
        <h3 style={{ fontSize: 16, marginBottom: 10 }}>All employees ({initialEmployees.length})</h3>
        {initialEmployees.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No employees added yet.</p>
        ) : (
          <table>
            <thead><tr><th>Employee ID</th><th>Name</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {initialEmployees.map((e) => (
                <tr key={e.id}>
                  <td>{e.employeeId}</td>
                  <td>{e.name}</td>
                  <td>
                    <span className={`badge ${e.active ? "badge-approved" : "badge-rejected"}`}>
                      {e.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button className="btn" style={{ padding: "5px 10px", fontSize: 12 }} disabled={busyId === e.id} onClick={() => resetPin(e.id)}>
                      Reset PIN
                    </button>
                    <button
                      className="btn"
                      style={{ padding: "5px 10px", fontSize: 12 }}
                      disabled={busyId === e.id}
                      onClick={() => toggleActive(e.id, e.active)}
                    >
                      {e.active ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
