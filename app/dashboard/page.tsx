"use client";

import { useEffect, useMemo, useState } from "react";
import { TEAM } from "@/lib/team";
import type { Submission } from "@/lib/supabase";

const SECTION_LABELS: { key: keyof Submission; title: string }[] = [
  { key: "key_projects", title: "1. Key Projects & Automation Wins" },
  { key: "ai_tools", title: "2. AI Tools in Use & Under Review" },
  { key: "efficiency_learnings", title: "3. Efficiency Breakthroughs & Learnings" },
  { key: "future_automations", title: "4. Future Automations / Ideas" },
  { key: "human_impact", title: "5. Human Impact" },
  { key: "challenges", title: "6. Challenges or Roadblocks" },
];

export default function Dashboard() {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [memberFilter, setMemberFilter] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/submissions")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setSubmissions(data.submissions);
        if (data.submissions?.length) {
          setSelectedWeek(data.submissions[0].week_range);
        }
      })
      .catch((err) => setLoadError(err.message || "Could not load submissions."));
  }, []);

  const weeks = useMemo(() => {
    if (!submissions) return [];
    const seen: string[] = [];
    for (const s of submissions) {
      if (!seen.includes(s.week_range)) seen.push(s.week_range);
    }
    return seen;
  }, [submissions]);

  const submittedNamesForWeek = useMemo(() => {
    if (!submissions || !selectedWeek) return new Set<string>();
    return new Set(
      submissions.filter((s) => s.week_range === selectedWeek).map((s) => s.member_name)
    );
  }, [submissions, selectedWeek]);

  function findSubmissionFor(memberName: string): Submission | undefined {
    return submissions?.find(
      (s) => s.week_range === selectedWeek && s.member_name === memberName
    );
  }

  const visibleSubmissions = useMemo(() => {
    if (!submissions) return [];
    return submissions.filter((s) => {
      if (selectedWeek && s.week_range !== selectedWeek) return false;
      if (memberFilter && s.member_name !== memberFilter) return false;
      return true;
    });
  }, [submissions, selectedWeek, memberFilter]);

  return (
    <div className="shell shell--wide">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div className="eyebrow">Tytan · Weekly Reporting</div>
          <h1 className="page-title">Leader Dashboard</h1>
        </div>
        <a className="nav-link" href="/">
          ← Submit a report
        </a>
      </div>
      <p className="page-sub">
        Roll call shows who's turned in this week's summary. Click a
        submitted name to jump to their report below.
      </p>

      {loadError && <div className="error-banner">{loadError}</div>}

      {submissions === null && !loadError && (
        <div className="loading-state">Loading submissions…</div>
      )}

      {submissions !== null && (
        <>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="field-row" style={{ marginBottom: 18 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label htmlFor="rc-week">Week</label>
                <select
                  id="rc-week"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                >
                  {weeks.length === 0 && <option value="">No submissions yet</option>}
                  {weeks.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label>Roll call</label>
            <div className="rollcall">
              {TEAM.map((m) => {
                const submitted = submittedNamesForWeek.has(m.name);
                return (
                  <div
                    key={m.email}
                    className={`rollcall-pill${submitted ? " is-submitted" : ""}`}
                    onClick={() => {
                      if (!submitted) return;
                      const sub = findSubmissionFor(m.name);
                      if (sub) {
                        setMemberFilter("");
                        setOpenId(sub.id);
                        document
                          .getElementById(`row-${sub.id}`)
                          ?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }}
                  >
                    <span className="rollcall-dot" />
                    {m.name}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="filters">
            <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
              {weeks.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            <select value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)}>
              <option value="">All team members</option>
              {TEAM.map((m) => (
                <option key={m.email} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {visibleSubmissions.length === 0 ? (
            <div className="empty-state">No reports for this filter yet.</div>
          ) : (
            visibleSubmissions.map((s) => {
              const open = openId === s.id;
              return (
                <div className="submission-row" id={`row-${s.id}`} key={s.id}>
                  <div
                    className="submission-row-head"
                    onClick={() => setOpenId(open ? null : s.id)}
                  >
                    <div>
                      <div className="submission-name">{s.member_name}</div>
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
                    <span className={`chevron${open ? " is-open" : ""}`}>▶</span>
                  </div>
                  {open && (
                    <div className="submission-body">
                      {SECTION_LABELS.map((sec) => (
                        <div className="submission-section" key={sec.key}>
                          <div className="submission-section-title">{sec.title}</div>
                          <div className="submission-section-body">
                            {String(s[sec.key] || "—")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </>
      )}
    </div>
  );
}
