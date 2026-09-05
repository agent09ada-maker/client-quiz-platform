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

const GEMINI_MODEL = "gemini-3.6-flash";

export async function generateQuestions(
  clientName: string,
  clientSummary: string,
  difficulty: keyof typeof DIFFICULTY_GUIDANCE,
  count: number
): Promise<DraftQuestion[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const prompt = `You are writing internal training quiz questions for employees to learn about a client account.

Client name: ${clientName}
Client background: ${clientSummary || "(no additional background provided)"}
Difficulty level: ${difficulty} — questions should be ${DIFFICULTY_GUIDANCE[difficulty]}.

Write exactly ${count} multiple-choice questions. Each question must have exactly 4 options with exactly one correct answer.

Respond with ONLY a JSON array, no preamble, no markdown fences, in this exact shape:
[{"prompt": "...", "options": ["...", "...", "...", "..."], "correctIndex": 0}]`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini did not return text content");
  }

  const cleaned = text.replace(/```json|```/g, "").trim();
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