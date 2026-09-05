import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type DraftQuestion = {
  prompt: string;
  options: string[];
  correctIndex: number;
};

const DIFFICULTY_GUIDANCE: Record<string, string> = {
  EASY: "basic, well-known facts a new employee could find in an intro brief",
  MEDIUM: "moderately detailed facts requiring some familiarity with the client relationship",
  HARD: "specific, detailed knowledge that only someone closely involved with the account would know",
  EXPERT: "nuanced, strategic-level knowledge combining multiple facts about the client relationship",
};

/**
 * Generates a fresh batch of draft quiz questions for a client at a given
 * difficulty. Questions come back as PENDING_REVIEW — an admin must approve
 * them before employees ever see them (see /app/admin/questions).
 */
export async function generateQuestions(
  clientName: string,
  clientSummary: string,
  difficulty: keyof typeof DIFFICULTY_GUIDANCE,
  count: number
): Promise<DraftQuestion[]> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `You are writing internal training quiz questions for employees to learn about a client account.

Client name: ${clientName}
Client background: ${clientSummary || "(no additional background provided)"}
Difficulty level: ${difficulty} — questions should be ${DIFFICULTY_GUIDANCE[difficulty]}.

Write exactly ${count} multiple-choice questions. Each question must have exactly 4 options with exactly one correct answer.

Respond with ONLY a JSON array, no preamble, no markdown fences, in this exact shape:
[{"prompt": "...", "options": ["...", "...", "...", "..."], "correctIndex": 0}]`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("AI did not return text content");
  }

  const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned) as DraftQuestion[];

  return parsed.filter(
    (q) =>
      q.prompt &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.correctIndex >= 0 &&
      q.correctIndex < 4
  );
}
