"use client";

import { useEffect, useMemo, useState } from "react";
import { TEAM } from "@/lib/team";
import type { Submission } from "@/lib/supabase";
import type { Viewer } from "@/lib/team";

const SECTION_LABELS: { key: keyof Submission; title: string }[] = [
  { key: "key_projects", title: "1. Key Projects & Automation Wins" },
  { key: "ai_tools", title: "2. AI Tools in Use & Under Review" },
  { key: "efficiency_learnings", title: "3. Efficiency Breakthroughs & Learnings" },
  { key: "future_automations", title: "4. Future Automations / Ideas" },
  { key: "human_impact", title: "5. Human Impact" },
  { key: "challenges", title: "6. Challenges or Roadblocks" },
  { key: "next_steps", title: "7. Next Steps / Preparations" },
];

export default function Dashboard() {
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [memberFilter, setMemberFilter] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/submissions")
      .then(async (r) => {
        if (r.status === 401) {
          setUnauthorized(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.error) throw new Error(data.error);
        setViewer(data.viewer);
        setSubmissions(data.submissions);
        if (data.submissions?.length) {
          setSelectedWeek(data.submissions[0].week_range);
        }
      })
      .catch((err) => setLoadError(err.message || "Could not load submissions."));
  }, []);

  const visibleTeamNames = useMemo(() => {
    if (!viewer) return [];
    return viewer.seesAll ? TEAM.map((m) => m.name) : viewer.visibleNames;
  }, [viewer]);

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
      submissions.filter((s) => s.week_range === selectedWeek && !s.is_test).map((s) => s.member_name)
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
      if (search.trim()) {
        const haystack = [
          s.member_name,
          s.shift_schedule,
          ...SECTION_LABELS.map((sec) => String(s[sec.key] || "")),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [submissions, selectedWeek, memberFilter, search]);

  function exportCsv() {
    const headers = [
      "Member Name",
      "Position",
      "Shift Schedule",
      "Work Week",
      ...SECTION_LABELS.map((sec) => sec.title),
      "Submitted At",
    ];
    const rows = visibleSubmissions.map((s) => [
      s.member_name,
      s.position,
      s.shift_schedule,
      s.week_range,
      ...SECTION_LABELS.map((sec) => String(s[sec.key] || "")),
      s.submitted_at,
    ]);
    const escapeCell = (val: string) => `"${String(val).replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tytan-weekly-summaries-${selectedWeek || "export"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleLogout() {
    await fetch("/api/dashboard-logout", { method: "POST" });
    window.location.href = "/dashboard/login";
  }

  if (unauthorized) {
    // Middleware should normally catch this before the page even loads,
    // but this covers the case where a session cookie expired mid-visit.
    if (typeof window !== "undefined") window.location.href = "/dashboard/login";
    return null;
  }

  return (
    <div className="shell shell--wide">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div className="eyebrow">Weekly Reporting</div>
          <h1 className="page-title">Leader Dashboard</h1>
        </div>
        <a className="nav-link" href="/">
          ← Submit a report
        </a>
      </div>

      {viewer && (
        <div className="viewer-bar">
          Viewing as <strong>{viewer.label}</strong>
          <button className="btn-secondary" onClick={handleLogout} style={{ padding: "4px 10px" }}>
            Log out
          </button>
        </div>
      )}

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
              {TEAM.filter((m) => visibleTeamNames.includes(m.name)).map((m) => {
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
              {TEAM.filter((m) => visibleTeamNames.includes(m.name)).map((m) => (
                <option key={m.email} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search reports…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 220 }}
            />
            <button
              className="btn-secondary"
              onClick={exportCsv}
              disabled={visibleSubmissions.length === 0}
            >
              Export CSV
            </button>
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
                      <div className="submission-name">
                        {s.member_name}
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
                      <a
                        className="nav-link"
                        href={`/print/${s.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Print
                      </a>
                      <span className={`chevron${open ? " is-open" : ""}`}>▶</span>
                    </div>
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
