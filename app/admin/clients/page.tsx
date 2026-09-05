import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import AdminShell from "../AdminShell";
import ClientsManager from "./ClientsManager";

export default async function ClientsPage() {
  await requireAdmin();

  const clients = await db.client.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { questions: true } },
    },
  });

  return (
    <AdminShell active="/admin/clients">
      <div className="page">
        <div className="page-head">
          <div>
            <h2>Clients & questions</h2>
            <p>Add clients and generate AI question drafts for each difficulty level.</p>
          </div>
        </div>
        <ClientsManager
          initialClients={clients.map((c) => ({
            id: c.id,
            name: c.name,
            summary: c.summary,
            active: c.active,
            questionCount: c._count.questions,
          }))}
        />
      </div>
    </AdminShell>
  );
}
