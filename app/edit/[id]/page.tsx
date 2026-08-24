"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Submission } from "@/lib/supabase";

const SECTIONS: { key: keyof Submission; title: string }[] = [
  { key: "key_projects", title: "1. Key Projects & Automation Wins" },
  { key: "ai_tools", title: "2. AI Tools in Use & Under Review" },
  { key: "efficiency_learnings", title: "3. Efficiency Breakthroughs & Learnings" },
  { key: "future_automations", title: "4. Future Automations / Ideas" },
  { key: "human_impact", title: "5. Human Impact" },
  { key: "challenges", title: "6. Challenges or Roadblocks" },
  { key: "next_steps", title: "7. Next Steps / Preparations" },
];

export default function EditReport() {
  const params = useParams();
  const id = params?.id as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [editable, setEditable] = useState(true);
  const [windowHours, setWindowHours] = useState(24);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/submissions/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setSubmission(data.submission);
        setEditable(data.editable);
        setWindowHours(data.editWindowHours);
        const initial: Record<string, string> = {};
        for (const s of SECTIONS) initial[s.key] = data.submission[s.key] || "";
        initial.shift_schedule = data.submission.shift_schedule || "";
        setForm(initial);
      })
      .catch((err) => setError(err.message || "Could not load this report."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save changes.");
      setSaved(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="shell">
        <div className="loading-state">Loading…</div>
      </div>
    );
  }

  if (error && !submission) {
    return (
      <div className="shell">
        <div className="error-banner">{error}</div>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="shell">
        <div className="card success-card">
          <div className="success-mark">✓</div>
          <div className="page-title" style={{ marginBottom: 8 }}>
            Changes saved
          </div>
          <p className="page-sub" style={{ marginBottom: 24 }}>
            Your report for {submission?.week_range} has been updated.
          </p>
          <a className="btn-secondary" href="/my-reports">
            Back to my reports
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      <div className="eyebrow">Weekly Reporting</div>
      <h1 className="page-title">Edit Report</h1>
      <p className="page-sub">
        {submission?.member_name} · {submission?.week_range}
        {!editable && (
          <>
            {" "}
            — the {windowHours}-hour edit window for this report has passed; it can no
            longer be changed.
          </>
        )}
      </p>

      {error && <div className="error-banner">{error}</div>}

      <form className="card" onSubmit={handleSave}>
        <div className="field">
          <label htmlFor="shift_schedule">Shift Schedule</label>
          <input
            id="shift_schedule"
            type="text"
            value={form.shift_schedule || ""}
            onChange={(e) => setForm((f) => ({ ...f, shift_schedule: e.target.value }))}
            disabled={!editable}
          />
        </div>

        {SECTIONS.map((s, i) => (
          <div className="field" key={s.key}>
            <div className="section-title">
              <span className="section-number">{i + 1}</span>
              {s.title}
            </div>
            <textarea
              value={form[s.key] || ""}
              onChange={(e) => setForm((f) => ({ ...f, [s.key]: e.target.value }))}
              disabled={!editable}
            />
          </div>
        ))}

        {editable && (
          <button className="btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        )}
      </form>
    </div>
  );
}
