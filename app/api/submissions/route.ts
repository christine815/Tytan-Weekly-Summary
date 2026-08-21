import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { TEAM, VIEWERS } from "@/lib/team";

export async function GET(req: NextRequest) {
  const viewerId = req.cookies.get("dashboard_viewer")?.value;
  const viewer = VIEWERS.find((v) => v.id === viewerId);

  if (!viewer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const visibleNames = viewer.seesAll ? TEAM.map((m) => m.name) : viewer.visibleNames;

  const week = req.nextUrl.searchParams.get("week");
  const member = req.nextUrl.searchParams.get("member");

  try {
    const supabase = getSupabaseServerClient();
    let query = supabase
      .from("submissions")
      .select("*")
      .in("member_name", visibleNames)
      .order("submitted_at", { ascending: false });

    if (week) query = query.eq("week_range", week);
    if (member) query = query.eq("member_name", member);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ viewer, submissions: data });
  } catch (err: any) {
    console.error("Fetch submissions error:", err);
    return NextResponse.json(
      { error: "Could not load submissions." },
      { status: 500 }
    );
  }
}
