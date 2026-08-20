:root {
  --bg: #f5f6f8;
  --surface: #ffffff;
  --ink: #14171f;
  --ink-muted: #5b6270;
  --border: #e2e5ea;
  --accent: #2e6f5e;
  --accent-dark: #21503f;
  --accent-tint: #e7f0ec;
  --pending: #b8842e;
  --pending-tint: #fbf1e0;
  --font-display: "Space Grotesk", Georgia, serif;
  --font-body: "IBM Plex Sans", -apple-system, Helvetica, Arial, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, Menlo, monospace;
}

* {
  box-sizing: border-box;
}

html,
body {
  padding: 0;
  margin: 0;
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--accent);
}

button {
  font-family: inherit;
}

.shell {
  max-width: 760px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.shell--wide {
  max-width: 980px;
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
}

.page-title {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 600;
  margin: 6px 0 4px;
  letter-spacing: -0.01em;
}

.page-sub {
  color: var(--ink-muted);
  font-size: 14px;
  margin: 0 0 32px;
  line-height: 1.6;
}

.nav-link {
  font-size: 13px;
  font-family: var(--font-mono);
  color: var(--ink-muted);
  text-decoration: none;
  border-bottom: 1px solid transparent;
}

.nav-link:hover {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 28px;
}

.field {
  margin-bottom: 22px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 560px) {
  .field-row {
    grid-template-columns: 1fr;
  }
}

label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--ink);
}

.field-hint {
  font-size: 12px;
  color: var(--ink-muted);
  margin: -2px 0 8px;
  line-height: 1.5;
}

input[type="text"],
select,
textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: var(--font-body);
  color: var(--ink);
  background: var(--surface);
  transition: border-color 0.15s ease;
}

input[type="text"]:focus,
select:focus,
textarea:focus {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
  border-color: var(--accent);
}

textarea {
  min-height: 92px;
  resize: vertical;
  line-height: 1.5;
}

input:disabled,
select:disabled {
  background: var(--bg);
  color: var(--ink-muted);
}

.section-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 5px;
  background: var(--accent-tint);
  color: var(--accent-dark);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  margin-right: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}

.btn-primary {
  background: var(--ink);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-dark);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.btn-secondary:hover {
  border-color: var(--ink);
}

.error-banner {
  background: #fbe9e7;
  border: 1px solid #e8b4ac;
  color: #8a3324;
  padding: 12px 14px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 20px;
}

.success-card {
  text-align: center;
  padding: 56px 28px;
}

.success-mark {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  font-size: 20px;
}

/* Roll call */
.rollcall {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.rollcall-pill {
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 6px 12px 6px 8px;
  font-size: 12.5px;
  background: var(--surface);
  cursor: default;
}

.rollcall-pill.is-submitted {
  border-color: var(--accent);
  background: var(--accent-tint);
  cursor: pointer;
}

.rollcall-pill.is-submitted:hover {
  background: #dcece5;
}

.rollcall-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--pending);
  flex-shrink: 0;
}

.rollcall-pill.is-submitted .rollcall-dot {
  background: var(--accent);
}

/* Dashboard filters */
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filters select {
  width: auto;
  min-width: 180px;
}

/* Submission list */
.submission-row {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  margin-bottom: 10px;
  overflow: hidden;
}

.submission-row-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  cursor: pointer;
}

.submission-row-head:hover {
  background: var(--bg);
}

.submission-name {
  font-weight: 600;
  font-size: 14px;
}

.submission-meta {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-muted);
  margin-top: 2px;
}

.chevron {
  color: var(--ink-muted);
  font-size: 12px;
  transition: transform 0.15s ease;
}

.chevron.is-open {
  transform: rotate(90deg);
}

.submission-body {
  padding: 4px 18px 18px;
  border-top: 1px solid var(--border);
}

.submission-section {
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}

.submission-section:last-child {
  border-bottom: none;
}

.submission-section-title {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 5px;
}

.submission-section-body {
  font-size: 13.5px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: var(--ink-muted);
  font-size: 14px;
  border: 1px dashed var(--border);
  border-radius: 10px;
}

.loading-state {
  text-align: center;
  padding: 48px 20px;
  color: var(--ink-muted);
  font-size: 13px;
  font-family: var(--font-mono);
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tytan Weekly Summary",
  description: "Weekly work summary reporting for the Tytan team.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

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
