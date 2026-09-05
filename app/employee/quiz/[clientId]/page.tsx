import { db } from "@/lib/db";
import { requireEmployee } from "@/lib/session";
import QuizRunner from "./QuizRunner";

const VALID_DIFFICULTIES = ["EASY", "MEDIUM", "HARD", "EXPERT"] as const;
const QUESTIONS_PER_QUIZ = 8;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: { clientId: string };
  searchParams: { difficulty?: string };
}) {
  await requireEmployee();

  const difficulty = VALID_DIFFICULTIES.includes(searchParams.difficulty as any)
    ? (searchParams.difficulty as (typeof VALID_DIFFICULTIES)[number])
    : "EASY";

  const client = await db.client.findUnique({ where: { id: params.clientId } });

  const allApproved = await db.question.findMany({
    where: { clientId: params.clientId, difficulty, status: "APPROVED" },
  });

  const selected = shuffle(allApproved).slice(0, QUESTIONS_PER_QUIZ);

  if (!client || selected.length === 0) {
    return (
      <div className="page">
        <div className="card empty-state">
          No approved {difficulty.toLowerCase()} questions for this client yet. Ask your admin to add some, or try
          another difficulty.
        </div>
      </div>
    );
  }

  const questionsForClient = selected.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    options: JSON.parse(q.options) as string[],
  }));

  return (
    <QuizRunner
      clientId={client.id}
      clientName={client.name}
      difficulty={difficulty}
      questions={questionsForClient}
    />
  );
}
