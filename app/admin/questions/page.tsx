import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import AdminShell from "../AdminShell";
import ReviewQueue from "./ReviewQueue";

export default async function QuestionsPage() {
  await requireAdmin();

  const pending = await db.question.findMany({
    where: { status: "PENDING_REVIEW" },
    include: { client: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <AdminShell active="/admin/questions">
      <div className="page">
        <div className="page-head">
          <div>
            <h2>Review queue</h2>
            <p>AI-drafted questions wait here until an admin approves or rejects them.</p>
          </div>
        </div>
        <ReviewQueue
          questions={pending.map((q) => ({
            id: q.id,
            clientName: q.client.name,
            difficulty: q.difficulty,
            prompt: q.prompt,
            options: JSON.parse(q.options) as string[],
            correctIndex: q.correctIndex,
          }))}
        />
      </div>
    </AdminShell>
  );
}
