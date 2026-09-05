"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = { id: string; prompt: string; options: string[] };

export default function QuizRunner({
  clientId,
  clientName,
  difficulty,
  questions,
}: {
  clientId: string;
  clientName: string;
  difficulty: string;
  questions: Question[];
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; selectedIndex: number }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const current = questions[index];
  const isLast = index === questions.length - 1;

  function selectOption(i: number) {
    setSelected(i);
  }

  async function next() {
    if (selected === null) return;
    const updated = [...answers, { questionId: current.id, selectedIndex: selected }];
    setAnswers(updated);
    setSelected(null);

    if (isLast) {
      setSubmitting(true);
      const res = await fetch("/api/employee/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, difficulty, answers: updated }),
      });
      const data = await res.json();
      setSubmitting(false);
      if (res.ok) {
        router.push(`/employee/result/${data.attemptId}`);
      }
    } else {
      setIndex(index + 1);
    }
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="topbar-inner">
          <h1>{clientName} <span className="role-tag">{difficulty}</span></h1>
        </div>
      </div>
      <div className="page" style={{ maxWidth: 640 }}>
        <div style={{ marginBottom: 20 }}>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${((index + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 8 }}>
            Question {index + 1} of {questions.length}
          </p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 19, marginBottom: 18 }}>{current.prompt}</h2>
          {current.options.map((opt, i) => (
            <button
              key={i}
              className={`quiz-option ${selected === i ? "selected" : ""}`}
              onClick={() => selectOption(i)}
            >
              {opt}
            </button>
          ))}
          <button
            className="btn btn-primary"
            style={{ marginTop: 12 }}
            disabled={selected === null || submitting}
            onClick={next}
          >
            {submitting ? "Submitting…" : isLast ? "Finish quiz" : "Next question"}
          </button>
        </div>
      </div>
    </div>
  );
}
