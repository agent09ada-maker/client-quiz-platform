import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const { name, summary } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Client name is required." }, { status: 400 });
  }

  const client = await db.client.create({ data: { name, summary: summary || null } });
  return NextResponse.json({ client });
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const clients = await db.client.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ clients });
}
