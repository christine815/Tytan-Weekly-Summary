"use client";

import { useState } from "react";
import { TEAM } from "@/lib/team";
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

export default function MyReports() {
  const [name, setName] = useState("");
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const EDIT_WINDOW_HOURS = 24;

  function isEditable(submittedAt: string) {
    const hoursSince = (Date.now() - new Date(submittedAt).getTime()) / (1000 * 60 * 60);
    return hoursSince <= EDIT_WINDOW_HOURS;
  }

  const filtered = (submissions || []).filter((s) => {
    if (!search.trim()) return true;
    const haystack = [
      s.week_range,
      s.shift_schedule,
      ...SECTION_LABELS.map((sec) => String(s[sec.key] || "")),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  async function handleLoad() {
    if (!name) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/my-reports?name=${encodeURIComponent(name)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load your reports.");
      setSubmissions(data.submissions);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell shell--wide">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div className="eyebrow">Weekly Reporting</div>
          <h1 className="page-title">My Submitted Reports</h1>
        </div>
        <a className="nav-link" href="/">
          ← Back to form
        </a>
      </div>
      <p className="page-sub">
        Pick your name to see every report you've submitted, exactly as you wrote it.
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="field-row" style={{ marginBottom: 0, alignItems: "end" }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="my-name">Your name</label>
            <select id="my-name" value={name} onChange={(e) => setName(e.target.value)}>
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
          <div className="field" style={{ marginBottom: 0 }}>
            <button className="btn-primary" onClick={handleLoad} disabled={!name || loading}>
              {loading ? "Loading…" : "View my reports"}
            </button>
          </div>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {submissions !== null && submissions.length > 0 && (
        <div className="field" style={{ maxWidth: 320 }}>
          <input
            type="text"
            placeholder="Search your reports…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {submissions !== null && submissions.length === 0 && (
        <div className="empty-state">No reports found for {name} yet.</div>
      )}

      {submissions !== null && submissions.length > 0 && filtered.length === 0 && (
        <div className="empty-state">No reports match "{search}".</div>
      )}

      {filtered.map((s) => {
          const open = openId === s.id;
          const editable = isEditable(s.submitted_at);
          return (
            <div className="submission-row" key={s.id}>
              <div className="submission-row-head" onClick={() => setOpenId(open ? null : s.id)}>
                <div>
                  <div className="submission-name">
                    {s.week_range}
                    {s.is_test && <span className="test-badge">Test</span>}
                  </div>
                  <div className="submission-meta">
                    {s.position} · {s.shift_schedule} · submitted{" "}
                    {new Date(s.submitted_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {editable && (
                    <a
                      className="nav-link"
                      href={`/edit/${s.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </a>
                  )}
                  <span className={`chevron${open ? " is-open" : ""}`}>▶</span>
                </div>
              </div>
              {open && (
                <div className="submission-body">
                  {SECTION_LABELS.map((sec) => (
                    <div className="submission-section" key={sec.key}>
                      <div className="submission-section-title">{sec.title}</div>
                      <div className="submission-section-body">{String(s[sec.key] || "—")}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
