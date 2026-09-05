import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="auth-screen">
      <div className="auth-glow one" />
      <div className="auth-glow two" />
      <div className="auth-card" style={{ maxWidth: 460, textAlign: "center" }}>
        <div className="logo-row">
          <Image src="/logo.png" alt="ADA Tech Solutions" width={90} height={90} />
        </div>
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
