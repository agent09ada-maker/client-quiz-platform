import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import AdminShell from "../AdminShell";
import EmployeesManager from "./EmployeesManager";

export default async function EmployeesPage() {
  await requireAdmin();

  const employees = await db.employee.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, employeeId: true, name: true, active: true, createdAt: true },
  });

  return (
    <AdminShell active="/admin/employees">
      <div className="page">
        <div className="page-head">
          <div>
            <h2>Employees</h2>
            <p>Add employees one at a time, or in bulk via CSV paste. Supports 400+ employees.</p>
          </div>
        </div>
        <EmployeesManager
          initialEmployees={employees.map((e) => ({
            ...e,
            createdAt: e.createdAt.toISOString(),
          }))}
        />
      </div>
    </AdminShell>
  );
}
