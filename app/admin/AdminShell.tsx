import Link from "next/link";
import LogoutButton from "./LogoutButton";

const NAV = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/clients", label: "Clients & questions" },
  { href: "/admin/questions", label: "Review queue" },
  { href: "/admin/employees", label: "Employees" },
  { href: "/admin/results", label: "Results" },
];

export default function AdminShell({
  active,
  children,
}: {
  active: string;
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="topbar-inner">
          <h1>Client Knowledge Quiz <span className="role-tag">Admin</span></h1>
          <LogoutButton />
        </div>
      </div>
      <div className="topbar" style={{ borderTop: "none" }}>
        <div className="topbar-inner" style={{ padding: "8px 24px" }}>
          <nav className="nav-links">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={active === item.href ? "active" : ""}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
