"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/employee/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, pin }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/employee/dashboard");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Sign in failed. Check your employee ID and PIN.");
    }
  }

  return (
    <main className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Employee sign in</h1>
        <p className="sub">Use the employee ID and PIN you were given.</p>

        <div className="field">
          <label htmlFor="employeeId">Employee ID</label>
          <input
            id="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="e.g. EMP0231"
            autoFocus
            required
          />
        </div>
        <div className="field">
          <label htmlFor="pin">PIN</label>
          <input
            id="pin"
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="4–6 digit PIN"
            required
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        {error && <p className="error-text">{error}</p>}
      </form>
    </main>
  );
}
