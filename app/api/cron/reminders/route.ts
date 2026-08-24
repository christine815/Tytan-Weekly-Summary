import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseServerClient } from "@/lib/supabase";
import { TEAM } from "@/lib/team";
import { currentWorkWeekLabel } from "@/lib/week";

/**
 * Runs every Friday 23:00 UTC (Saturday 7:00 AM Manila time — see
 * vercel.json for the schedule). Sends a direct reminder to anyone on
 * the team who hasn't submitted their weekly summary yet.
 *
 * Vercel Cron calls this with an Authorization header containing
 * CRON_SECRET, which we verify to make sure nobody else can trigger it.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const weekRange = currentWorkWeekLabel();
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_FROM_EMAIL;

  if (!apiKey || !from) {
    return NextResponse.json(
      { skipped: true, reason: "email not configured" },
      { status: 200 }
    );
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("submissions")
      .select("member_name")
      .eq("week_range", weekRange)
      .eq("is_test", false);

    if (error) throw error;

    const submittedNames = new Set((data ?? []).map((s) => s.member_name));
    const missing = TEAM.filter((m) => !submittedNames.has(m.name));

    const resend = new Resend(apiKey);
    const formUrl = process.env.NEXT_PUBLIC_APP_URL || "";

    const results = await Promise.allSettled(
      missing.map((m) =>
        resend.emails.send({
          from,
          to: [m.email],
          subject: `Reminder: Weekly Summary due — ${weekRange}`,
          html: `
            <div style="max-width: 480px; margin: 0 auto; font-family: -apple-system, Helvetica, Arial, sans-serif;">
              <div style="background: #10125F; padding: 20px 24px; border-radius: 8px 8px 0 0;">
                <div style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #E4C423;">Reminder</div>
                <div style="font-size: 18px; color: #fff; margin-top: 4px;">Weekly Summary — ${weekRange}</div>
              </div>
              <div style="background: #fff; border: 1px solid #E2E5EA; border-top: none; border-radius: 0 0 8px 8px; padding: 20px 24px; font-size: 14px; color: #10125F; line-height: 1.6;">
                Hi ${m.name.split(" ")[0]}, it looks like your weekly summary for ${weekRange} hasn't come in yet.
                ${formUrl ? `<br/><br/><a href="${formUrl}" style="color:#10125F;">Submit it here</a> whenever you get a chance.` : ""}
              </div>
            </div>`,
        })
      )
    );

    return NextResponse.json({
      weekRange,
      remindersSent: missing.map((m) => m.email),
      results: results.map((r) => r.status),
    });
  } catch (err: any) {
    console.error("Reminder cron error:", err);
    return NextResponse.json({ error: "Reminder run failed." }, { status: 500 });
  }
}
