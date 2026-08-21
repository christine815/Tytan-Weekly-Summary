"use client";

import { useState } from "react";
import { VIEWERS } from "@/lib/team";

export default function DashboardLogin() {
  const [viewerId, setViewerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/dashboard-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewerId, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Incorrect password.");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="shell">
      <div className="auth-screen">
        <div className="wordmark">TYTAN TEAMS</div>
        <div className="eyebrow">Weekly Reporting</div>
        <h1 className="page-title">Leader Dashboard</h1>
        <p className="page-sub">
          Only leaders and the owner can access this page. Select your name
          and enter your own dashboard password.
        </p>
        {error && <div className="error-banner">{error}</div>}
        <form className="card" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="viewer">Who are you?</label>
            <select
              id="viewer"
              value={viewerId}
              onChange={(e) => setViewerId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select your name
              </option>
              {VIEWERS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="password">Your password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={submitting} style={{ width: "100%" }}>
            {submitting ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
