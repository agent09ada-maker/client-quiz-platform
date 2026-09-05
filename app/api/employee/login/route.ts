import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { employeeId, pin } = await req.json();

  if (!employeeId || !pin) {
    return NextResponse.json({ error: "Employee ID and PIN are required." }, { status: 400 });
  }

  const employee = await db.employee.findUnique({ where: { employeeId } });

  if (!employee || !employee.active) {
    return NextResponse.json({ error: "Employee ID or PIN is incorrect." }, { status: 401 });
  }

  const valid = await bcrypt.compare(pin, employee.pinHash);
  if (!valid) {
    return NextResponse.json({ error: "Employee ID or PIN is incorrect." }, { status: 401 });
  }

  await createSessionCookie({ role: "employee", id: employee.id, employeeId: employee.employeeId, name: employee.name });
  return NextResponse.json({ ok: true });
}
