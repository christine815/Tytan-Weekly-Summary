"use client";

import { useEffect, useMemo, useState } from "react";
import { TEAM, findMember } from "@/lib/team";
import { currentWorkWeekLabel } from "@/lib/week";

const SECTIONS: {
  key:
    | "key_projects"
    | "ai_tools"
    | "efficiency_learnings"
    | "future_automations"
    | "human_impact"
    | "challenges"
    | "next_steps";
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
  {
    key: "next_steps",
    title: "Next Steps / Preparations",
    hint: "What are you planning or preparing for next week? Flag anything that needs setup, coordination, or a heads-up in advance.",
  },
];

const SHIFT_DAYS = ["Mon–Thurs", "Tue–Fri"];
const SHIFT_TIMES = ["9PM", "10PM", "11PM", "12MN"];

type FormState = {
  member_name: string;
  shift_days: string;
  shift_time: string;
  week_range: string;
} & Record<(typeof SECTIONS)[number]["key"], string>;

const emptySections = SECTIONS.reduce(
  (acc, s) => ({ ...acc, [s.key]: "" }),
  {} as Record<(typeof SECTIONS)[number]["key"], string>
);

function initialForm(): FormState {
  return {
    member_name: "",
    shift_days: "",
    shift_time: "",
    week_range: currentWorkWeekLabel(),
    ...emptySections,
  };
}

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm());
  const [isTest, setIsTest] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<{ week: string; date: string } | null | undefined>(
    undefined
  );

  const member = useMemo(() => findMember(form.member_name), [form.member_name]);

  useEffect(() => {
    if (!form.member_name) {
      setLastSubmitted(undefined);
      return;
    }
    let cancelled = false;
    setLastSubmitted(undefined);
    fetch(`/api/my-reports?name=${encodeURIComponent(form.member_name)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const latest = data.submissions?.[0];
        setLastSubmitted(
          latest
            ? {
                week: latest.week_range,
                date: new Date(latest.submitted_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }),
              }
            : null
        );
      })
      .catch(() => setLastSubmitted(null));
    return () => {
      cancelled = true;
    };
  }, [form.member_name]);

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
        body: JSON.stringify({
          ...form,
          shift_schedule: `${form.shift_days}, ${form.shift_time} start`,
          is_test: isTest,
        }),
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
            {isTest
              ? `Your test submission for ${form.week_range} was saved, and a copy of the notification email was sent to you so you can confirm it's working.`
              : `Your weekly summary for ${form.week_range} has been logged, your leader has been notified, and a copy was sent to your own inbox.`}
          </p>
          <button
            className="btn-secondary"
            onClick={() => {
              setDone(false);
              setIsTest(false);
              setForm(initialForm());
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
          marginBottom: 24,
        }}
      >
        <div>
          <div className="eyebrow">Weekly Reporting</div>
          <h1 className="page-title">Weekly Work Summary</h1>
        </div>
        <a className="nav-link" href="/dashboard">
          Dashboard →
        </a>
      </div>
      <div style={{ marginBottom: 24 }}>
        <a className="nav-link" href="/my-reports">
          View my submitted reports →
        </a>
      </div>

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
            {form.member_name && lastSubmitted !== undefined && (
              <div className="field-hint" style={{ marginTop: 6, marginBottom: 0 }}>
                {lastSubmitted === null
                  ? "No previous submissions found."
                  : `You last submitted for ${lastSubmitted.week} on ${lastSubmitted.date}.`}
              </div>
            )}
          </div>
          <div className="field">
            <label htmlFor="week_range">Work Week</label>
            <input
              id="week_range"
              type="text"
              value={form.week_range}
              readOnly
              title="Automatically set to the current work week"
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Current Position</label>
            <input type="text" value={member?.position ?? ""} disabled placeholder="Auto-filled from your name" />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="shift_days">Shift Days</label>
            <select
              id="shift_days"
              value={form.shift_days}
              onChange={(e) => update("shift_days", e.target.value)}
              required
            >
              <option value="" disabled>
                Select days
              </option>
              {SHIFT_DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="shift_time">Shift Start Time</label>
            <select
              id="shift_time"
              value={form.shift_time}
              onChange={(e) => update("shift_time", e.target.value)}
              required
            >
              <option value="" disabled>
                Select start time
              </option>
              {SHIFT_TIMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
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

        <label className="test-toggle">
          <input
            type="checkbox"
            checked={isTest}
            onChange={(e) => setIsTest(e.target.checked)}
          />
          This is a test submission — only send the notification to my own email
        </label>

        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Sending…" : isTest ? "Submit test" : "Submit report"}
        </button>
      </form>
    </div>
  );
}
