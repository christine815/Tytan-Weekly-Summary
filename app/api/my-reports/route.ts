import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { findMember } from "@/lib/team";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");

  if (!name || !findMember(name)) {
    return NextResponse.json({ error: "Select a valid team member." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("member_name", name)
      .order("submitted_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ submissions: data });
  } catch (err: any) {
    console.error("Fetch my-reports error:", err);
    return NextResponse.json({ error: "Could not load your reports." }, { status: 500 });
  }
}
