import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { generateQuestions } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const { clientId, difficulty, count } = await req.json();

  if (!clientId || !difficulty) {
    return NextResponse.json({ error: "clientId and difficulty are required." }, { status: 400 });
  }

  const client = await db.client.findUnique({ where: { id: clientId } });
  if (!client) {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server yet. Add it in your hosting provider's environment variables." },
      { status: 500 }
    );
  }

  try {
    const drafts = await generateQuestions(client.name, client.summary || "", difficulty, count || 5);

    if (drafts.length === 0) {
      return NextResponse.json({ error: "The AI didn't return usable questions. Try again." }, { status: 502 });
    }

    const year = new Date().getFullYear();
    await db.question.createMany({
      data: drafts.map((d) => ({
        clientId,
        difficulty,
        prompt: d.prompt,
        options: JSON.stringify(d.options),
        correctIndex: d.correctIndex,
        status: "PENDING_REVIEW",
        generatedYear: year,
      })),
    });

    return NextResponse.json({ created: drafts.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Question generation failed. Please try again." }, { status: 500 });
  }
}
