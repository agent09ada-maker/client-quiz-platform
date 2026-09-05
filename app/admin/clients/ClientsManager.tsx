"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ClientRow = {
  id: string;
  name: string;
  summary: string | null;
  active: boolean;
  questionCount: number;
};

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD", "EXPERT"];

export default function ClientsManager({ initialClients }: { initialClients: ClientRow[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [creating, setCreating] = useState(false);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function addClient(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, summary }),
    });
    setCreating(false);
    if (res.ok) {
      setName("");
      setSummary("");
      router.refresh();
    }
  }

  async function generate(clientId: string, difficulty: string) {
    setGeneratingFor(`${clientId}-${difficulty}`);
    setMessage("");
    const res = await fetch("/api/admin/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, difficulty, count: 5 }),
    });
    const data = await res.json().catch(() => ({}));
    setGeneratingFor(null);
    if (res.ok) {
      setMessage(`Drafted ${data.created} ${difficulty.toLowerCase()} questions — review them in the queue.`);
      router.refresh();
    } else {
      setMessage(data.error || "Generation failed.");
    }
  }

  return (
    <>
      <div className="card">
        <h3 style={{ fontSize: 16, marginBottom: 14 }}>Add a client</h3>
        <form onSubmit={addClient}>
          <div className="grid grid-2">
            <div className="field">
              <label>Client name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="field">
              <label>Background summary (used by AI to write questions)</label>
              <input value={summary} onChange={(e) => setSummary(e.target.value)} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: "auto", padding: "10px 20px" }} disabled={creating}>
            {creating ? "Adding…" : "Add client"}
          </button>
        </form>
      </div>

      {message && (
        <div className="card" style={{ borderColor: "var(--accent)" }}>
          {message}
        </div>
      )}

      {initialClients.map((client) => (
        <div className="card" key={client.id}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <h3 style={{ fontSize: 16 }}>{client.name}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                {client.questionCount} question{client.questionCount === 1 ? "" : "s"} total
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            {DIFFICULTIES.map((d) => {
              const key = `${client.id}-${d}`;
              return (
                <button
                  key={d}
                  className="btn"
                  style={{ fontSize: 13, padding: "7px 12px" }}
                  disabled={generatingFor === key}
                  onClick={() => generate(client.id, d)}
                >
                  {generatingFor === key ? "Generating…" : `Generate ${d.toLowerCase()} (AI)`}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
