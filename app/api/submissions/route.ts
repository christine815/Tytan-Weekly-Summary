import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const week = req.nextUrl.searchParams.get("week");
  const member = req.nextUrl.searchParams.get("member");

  try {
    const supabase = getSupabaseServerClient();
    let query = supabase
      .from("submissions")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (week) query = query.eq("week_range", week);
    if (member) query = query.eq("member_name", member);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ submissions: data });
  } catch (err: any) {
    console.error("Fetch submissions error:", err);
    return NextResponse.json(
      { error: "Could not load submissions." },
      { status: 500 }
    );
  }
}
