import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// How long after submitting someone can still edit their own report.
const EDIT_WINDOW_HOURS = 24;

function withinEditWindow(submittedAt: string): boolean {
  const hoursSince = (Date.now() - new Date(submittedAt).getTime()) / (1000 * 60 * 60);
  return hoursSince <= EDIT_WINDOW_HOURS;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    return NextResponse.json({
      submission: data,
      editable: withinEditWindow(data.submitted_at),
      editWindowHours: EDIT_WINDOW_HOURS,
    });
  } catch (err: any) {
    console.error("Fetch submission error:", err);
    return NextResponse.json({ error: "Could not load report." }, { status: 500 });
  }
}

const EDITABLE_FIELDS = [
  "shift_schedule",
  "key_projects",
  "ai_tools",
  "efficiency_learnings",
  "future_automations",
  "human_impact",
  "challenges",
  "next_steps",
];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));

  try {
    const supabase = getSupabaseServerClient();
    const { data: existing, error: fetchErr } = await supabase
      .from("submissions")
      .select("submitted_at")
      .eq("id", params.id)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    if (!withinEditWindow(existing.submitted_at)) {
      return NextResponse.json(
        { error: `The ${EDIT_WINDOW_HOURS}-hour edit window for this report has passed.` },
        { status: 403 }
      );
    }

    const updates: Record<string, string> = {};
    for (const field of EDITABLE_FIELDS) {
      if (typeof body[field] === "string") updates[field] = body[field];
    }

    const { data, error } = await supabase
      .from("submissions")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, submission: data });
  } catch (err: any) {
    console.error("Update submission error:", err);
    return NextResponse.json({ error: "Could not save your changes." }, { status: 500 });
  }
}
