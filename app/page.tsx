import Link from "next/link";

export default function Home() {
  return (
    <main className="auth-screen">
      <div className="auth-card" style={{ maxWidth: 460, textAlign: "center" }}>
        <h1>Client Knowledge Quiz</h1>
        <p className="sub">Choose how you're signing in.</p>
        <div style={{ display: "grid", gap: 12 }}>
          <Link href="/employee/login" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Employee sign in
          </Link>
          <Link href="/admin/login" className="btn" style={{ textDecoration: "none" }}>
            Admin sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
