import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const body = await req.json();
  const { status, prompt, options, correctIndex } = body;

  const data: any = {};
  if (status) data.status = status;
  if (prompt) data.prompt = prompt;
  if (options) data.options = JSON.stringify(options);
  if (typeof correctIndex === "number") data.correctIndex = correctIndex;

  const question = await db.question.update({ where: { id: params.id }, data });
  return NextResponse.json({ question });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  await db.question.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
