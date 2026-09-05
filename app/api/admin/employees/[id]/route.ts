import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

function randomPin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const body = await req.json();

  if (body.action === "reset-pin") {
    const pin = randomPin();
    const pinHash = await bcrypt.hash(pin, 10);
    await db.employee.update({ where: { id: params.id }, data: { pinHash } });
    return NextResponse.json({ pin });
  }

  if (body.action === "set-active") {
    await db.employee.update({ where: { id: params.id }, data: { active: !!body.active } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
