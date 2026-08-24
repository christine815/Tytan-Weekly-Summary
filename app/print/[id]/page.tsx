"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Submission } from "@/lib/supabase";

const SECTION_LABELS: { key: keyof Submission; title: string }[] = [
  { key: "key_projects", title: "1. Key Projects & Automation Wins" },
  { key: "ai_tools", title: "2. AI Tools in Use & Under Review" },
  { key: "efficiency_learnings", title: "3. Efficiency Breakthroughs & Learnings" },
  { key: "future_automations", title: "4. Future Automations / Ideas" },
  { key: "human_impact", title: "5. Human Impact" },
  { key: "challenges", title: "6. Challenges or Roadblocks" },
  { key: "next_steps", title: "7. Next Steps / Preparations" },
];

export default function PrintReport() {
  const params = useParams();
  const id = params?.id as string;
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/submissions/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setSubmission(data.submission);
      })
      .catch((err) => setError(err.message || "Could not load this report."));
  }, [id]);

  if (error) {
    return (
      <div className="shell">
        <div className="error-banner">{error}</div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="shell">
        <div className="loading-state">Loading…</div>
      </div>
    );
  }

  return (
    <div className="shell print-report">
      <button className="btn-primary no-print" onClick={() => window.print()} style={{ marginBottom: 20 }}>
        Print / Save as PDF
      </button>

      <div className="wordmark">TYTAN TEAMS</div>
      <h1 className="page-title" style={{ marginBottom: 2 }}>
        {submission.member_name}
      </h1>
      <p className="page-sub" style={{ marginBottom: 24 }}>
        {submission.position} · {submission.shift_schedule} · Week of {submission.week_range}
      </p>

      <div className="card">
        {SECTION_LABELS.map((sec) => (
          <div className="submission-section" key={sec.key}>
            <div className="submission-section-title">{sec.title}</div>
            <div className="submission-section-body">{String(submission[sec.key] || "—")}</div>
          </div>
        ))}
      </div>

      <p className="field-hint" style={{ marginTop: 16 }}>
        Submitted{" "}
        {new Date(submission.submitted_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
