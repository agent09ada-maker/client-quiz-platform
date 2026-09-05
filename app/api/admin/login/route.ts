import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const admin = await db.admin.findUnique({ where: { username } });
  if (!admin) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  await createSessionCookie({ role: "admin", id: admin.id, username: admin.username });
  return NextResponse.json({ ok: true });
}
