"use client";

import { useMemo, useState } from "react";
import { TEAM, findMember } from "@/lib/team";

function currentWorkWeekLabel(): string {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const monday = new Date(now);
  const diffToMonday = day === 0 ? -6 : 1 - day;
  monday.setDate(now.getDate() + diffToMonday);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const year = friday.getFullYear();
  return `${fmt(monday)}–${fmt(friday)}, ${year}`;
}

const SECTIONS: {
  key:
    | "key_projects"
    | "ai_tools"
    | "efficiency_learnings"
    | "future_automations"
    | "human_impact"
    | "challenges";
  title: string;
  hint: string;
}[] = [
  {
    key: "key_projects",
    title: "Key Projects & Automation Wins",
    hint: "Highlight major project progress, automations achieved, or efficiency breakthroughs this week. Avoid listing routine responsibilities.",
  },
  {
    key: "ai_tools",
    title: "AI Tools in Use & Under Review",
    hint: "List the tools or automations you actively used this week, plus any new tools being tested, explored, or recommended for consideration.",
  },
  {
    key: "efficiency_learnings",
    title: "Efficiency Breakthroughs & Learnings",
    hint: "Share lessons learned, hacks, or adjustments that saved time or reduced manual work. Even small wins count.",
  },
  {
    key: "future_automations",
    title: "Future Automations / Ideas",
    hint: "Suggest opportunities for future automation or AI adoption that could benefit your role, department, or the company.",
  },
  {
    key: "human_impact",
    title: "Human Impact",
    hint: "Where did your unique human contribution — judgment, creativity, empathy, relationship-building — make the difference this week?",
  },
  {
    key: "challenges",
    title: "Challenges or Roadblocks",
    hint: "Note any obstacles, especially those slowing down automation or scaling progress. Examples: tool limitations, process gaps, cross-team coordination.",
  },
];

type FormState = {
  member_name: string;
  shift_schedule: string;
  week_range: string;
} & Record<(typeof SECTIONS)[number]["key"], string>;

const emptySections = SECTIONS.reduce(
  (acc, s) => ({ ...acc, [s.key]: "" }),
  {} as Record<(typeof SECTIONS)[number]["key"], string>
);

export default function Home() {
  const [form, setForm] = useState<FormState>({
    member_name: "",
    shift_schedule: "",
    week_range: currentWorkWeekLabel(),
    ...emptySections,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const member = useMemo(() => findMember(form.member_name), [form.member_name]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Could not submit your report.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="shell">
        <div className="card success-card">
          <div className="success-mark">✓</div>
          <div className="page-title" style={{ marginBottom: 8 }}>
            Report sent
          </div>
          <p className="page-sub" style={{ marginBottom: 24 }}>
            Your weekly summary for {form.week_range} has been logged and your
            leaders have been notified.
          </p>
          <button
            className="btn-secondary"
            onClick={() => {
              setDone(false);
              setForm({
                member_name: "",
                shift_schedule: "",
                week_range: currentWorkWeekLabel(),
                ...emptySections,
              });
            }}
          >
            Submit another report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div>
          <div className="eyebrow">Tytan · Weekly Reporting</div>
          <h1 className="page-title">Weekly Work Summary</h1>
        </div>
        <a className="nav-link" href="/dashboard">
          Dashboard →
        </a>
      </div>
      <p className="page-sub">
        Fill this out once a week, same six sections your team already
        uses. Submitting sends it straight to your leaders — no copy-paste
        into email needed.
      </p>

      {error && <div className="error-banner">{error}</div>}

      <form className="card" onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label htmlFor="member_name">Team Member Name</label>
            <select
              id="member_name"
              value={form.member_name}
              onChange={(e) => update("member_name", e.target.value)}
              required
            >
              <option value="" disabled>
                Select your name
              </option>
              {TEAM.map((m) => (
                <option key={m.email} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="week_range">Work Week</label>
            <input
              id="week_range"
              type="text"
              value={form.week_range}
              onChange={(e) => update("week_range", e.target.value)}
              placeholder="Aug. 18–22, 2025"
              required
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Current Position</label>
            <input type="text" value={member?.position ?? ""} disabled placeholder="Auto-filled from your name" />
          </div>
          <div className="field">
            <label htmlFor="shift_schedule">Shift Schedule</label>
            <input
              id="shift_schedule"
              type="text"
              value={form.shift_schedule}
              onChange={(e) => update("shift_schedule", e.target.value)}
              placeholder="e.g. Mon–Fri, 9 AM–6 PM PHT"
              required
            />
          </div>
        </div>

        {SECTIONS.map((s, i) => (
          <div className="field" key={s.key}>
            <div className="section-title">
              <span className="section-number">{i + 1}</span>
              {s.title}
            </div>
            <div className="field-hint">{s.hint}</div>
            <textarea
              value={form[s.key]}
              onChange={(e) => update(s.key, e.target.value)}
              required
            />
          </div>
        ))}

        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Sending…" : "Submit report"}
        </button>
      </form>
    </div>
  );
}
