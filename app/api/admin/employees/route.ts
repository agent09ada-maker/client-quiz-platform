import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

function randomPin() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const { employees } = await req.json() as { employees: { employeeId: string; name: string }[] };

  if (!Array.isArray(employees) || employees.length === 0) {
    return NextResponse.json({ error: "No employees provided." }, { status: 400 });
  }

  const created: { employeeId: string; pin: string }[] = [];

  for (const e of employees) {
    if (!e.employeeId) continue;
    const pin = randomPin();
    const pinHash = await bcrypt.hash(pin, 10);
    try {
      await db.employee.create({
        data: { employeeId: e.employeeId, name: e.name || e.employeeId, pinHash },
      });
      created.push({ employeeId: e.employeeId, pin });
    } catch {
      // Likely a duplicate employeeId — skip it rather than fail the whole batch.
    }
  }

  return NextResponse.json({ created });
}
