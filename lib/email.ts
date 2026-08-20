import { Resend } from "resend";
import { LEADER_EMAILS } from "./team";
import type { NewSubmission } from "./supabase";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function section(title: string, body: string) {
  const safe = escapeHtml(body || "—").replace(/\n/g, "<br/>");
  return `
    <tr>
      <td style="padding: 18px 0; border-bottom: 1px solid #E2E5EA;">
        <div style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #2E6F5E; margin-bottom: 6px;">${escapeHtml(
          title
        )}</div>
        <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #14171F;">${safe}</div>
      </td>
    </tr>`;
}

export function buildReportHtml(sub: NewSubmission, dashboardUrl?: string) {
  return `
  <div style="max-width: 620px; margin: 0 auto; font-family: -apple-system, Helvetica, Arial, sans-serif;">
    <div style="background: #14171F; padding: 24px 28px; border-radius: 8px 8px 0 0;">
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #B8842E;">Weekly Summary</div>
      <div style="font-family: Georgia, serif; font-size: 22px; color: #FFFFFF; margin-top: 4px;">${escapeHtml(
        sub.member_name
      )} — ${escapeHtml(sub.week_range)}</div>
      <div style="font-size: 13px; color: #C7CBD3; margin-top: 6px;">${escapeHtml(
        sub.position
      )} · ${escapeHtml(sub.shift_schedule)}</div>
    </div>
    <table style="width: 100%; border-collapse: collapse; padding: 0 28px; background: #FFFFFF; border: 1px solid #E2E5EA; border-top: none;">
      <tbody style="display: block; padding: 0 28px;">
        ${section("1. Key Projects & Automation Wins", sub.key_projects)}
        ${section("2. AI Tools in Use & Under Review", sub.ai_tools)}
        ${section("3. Efficiency Breakthroughs & Learnings", sub.efficiency_learnings)}
        ${section("4. Future Automations / Ideas", sub.future_automations)}
        ${section("5. Human Impact", sub.human_impact)}
        ${section("6. Challenges or Roadblocks", sub.challenges)}
      </tbody>
    </table>
    <div style="padding: 18px 28px; background: #F5F6F8; border: 1px solid #E2E5EA; border-top: none; border-radius: 0 0 8px 8px; font-size: 13px; color: #5B6270;">
      ${
        dashboardUrl
          ? `View all reports on the <a href="${dashboardUrl}" style="color:#2E6F5E;">dashboard</a>.`
          : "Submitted via the Weekly Summary tool."
      }
    </div>
  </div>`;
}

export async function sendSubmissionNotification(sub: NewSubmission) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(
      "RESEND_API_KEY or NOTIFY_FROM_EMAIL not set — skipping email notification."
    );
    return { skipped: true };
  }

  const resend = new Resend(apiKey);
  const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    : undefined;

  return resend.emails.send({
    from,
    to: LEADER_EMAILS,
    subject: `Weekly Summary — ${sub.member_name} (${sub.week_range})`,
    html: buildReportHtml(sub, dashboardUrl),
  });
}
