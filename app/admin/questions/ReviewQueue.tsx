"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PendingQuestion = {
  id: string;
  clientName: string;
  difficulty: string;
  prompt: string;
  options: string[];
  correctIndex: number;
};

const badgeClass = (d: string) =>
  ({ EASY: "badge-easy", MEDIUM: "badge-medium", HARD: "badge-hard", EXPERT: "badge-expert" }[d] || "");

export default function ReviewQueue({ questions }: { questions: PendingQuestion[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PendingQuestion | null>(null);

  async function act(id: string, status: "APPROVED" | "REJECTED", body?: Partial<PendingQuestion>) {
    setBusyId(id);
    await fetch(`/api/admin/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...body }),
    });
    setBusyId(null);
    setEditingId(null);
    router.refresh();
  }

  if (questions.length === 0) {
    return <div className="card empty-state">Nothing waiting for review right now.</div>;
  }

  return (
    <>
      {questions.map((q) => (
        <div className="card" key={q.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{q.clientName}</span>
            <span className={`badge ${badgeClass(q.difficulty)}`}>{q.difficulty}</span>
          </div>

          {editingId === q.id && draft ? (
            <>
              <div className="field">
                <label>Question</label>
                <textarea
                  rows={2}
                  value={draft.prompt}
                  onChange={(e) => setDraft({ ...draft, prompt: e.target.value })}
                />
              </div>
              {draft.options.map((opt, i) => (
                <div className="field" key={i}>
                  <label>
                    Option {i + 1} {i === draft.correctIndex ? "(correct)" : ""}
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={opt}
                      onChange={(e) => {
                        const options = [...draft.options];
                        options[i] = e.target.value;
                        setDraft({ ...draft, options });
                      }}
                    />
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: "0 12px" }}
                      onClick={() => setDraft({ ...draft, correctIndex: i })}
                    >
                      Mark correct
                    </button>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-primary"
                  style={{ width: "auto", padding: "9px 16px" }}
                  disabled={busyId === q.id}
                  onClick={() => act(q.id, "APPROVED", draft)}
                >
                  Save & approve
                </button>
                <button className="btn" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: 15, marginBottom: 10 }}>{q.prompt}</p>
              <ul style={{ margin: "0 0 14px", paddingLeft: 18, fontSize: 14, color: "var(--text-muted)" }}>
                {q.options.map((opt, i) => (
                  <li key={i} style={{ color: i === q.correctIndex ? "var(--accent-strong)" : undefined }}>
                    {opt} {i === q.correctIndex ? "✓" : ""}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-primary"
                  style={{ width: "auto", padding: "9px 16px" }}
                  disabled={busyId === q.id}
                  onClick={() => act(q.id, "APPROVED")}
                >
                  Approve
                </button>
                <button
                  className="btn"
                  disabled={busyId === q.id}
                  onClick={() => {
                    setEditingId(q.id);
                    setDraft(q);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  disabled={busyId === q.id}
                  onClick={() => act(q.id, "REJECTED")}
                >
                  Reject
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
}
