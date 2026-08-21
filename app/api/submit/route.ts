import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient, type NewSubmission } from "@/lib/supabase";
import { sendSubmissionNotification } from "@/lib/email";
import { findMember, TEST_NOTIFY_EMAIL } from "@/lib/team";

const REQUIRED_FIELDS: (keyof NewSubmission)[] = [
  "member_name",
  "week_range",
  "shift_schedule",
  "key_projects",
  "ai_tools",
  "efficiency_learnings",
  "future_automations",
  "human_impact",
  "challenges",
  "next_steps",
];

export async function POST(req: NextRequest) {
  let body: Partial<NewSubmission>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || String(body[field]).trim() === "") {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  const member = findMember(body.member_name!);
  if (!member) {
    return NextResponse.json(
      { error: "Unrecognized team member." },
      { status: 400 }
    );
  }

  const submission: NewSubmission = {
    member_name: member.name,
    member_email: member.email,
    position: member.position,
    shift_schedule: body.shift_schedule!,
    week_range: body.week_range!,
    key_projects: body.key_projects!,
    ai_tools: body.ai_tools!,
    efficiency_learnings: body.efficiency_learnings!,
    future_automations: body.future_automations!,
    human_impact: body.human_impact!,
    challenges: body.challenges!,
    next_steps: body.next_steps!,
    is_test: Boolean(body.is_test),
  };

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("submissions")
      .insert(submission)
      .select()
      .single();

    if (error) throw error;

    // Don't let an email hiccup fail the submission — the report is saved either way.
    try {
      const recipient = submission.is_test ? TEST_NOTIFY_EMAIL : member.reportsTo;
      await sendSubmissionNotification(submission, recipient);
    } catch (emailErr) {
      console.error("Notification email failed:", emailErr);
    }

    return NextResponse.json({ ok: true, submission: data });
  } catch (err: any) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: "Could not save your report. Please try again." },
      { status: 500 }
    );
  }
}
