import { NextRequest, NextResponse } from "next/server";
import { VIEWERS } from "@/lib/team";

const COOKIE_NAME = "dashboard_viewer";

export async function POST(req: NextRequest) {
  const { viewerId, password } = await req.json().catch(() => ({ viewerId: "", password: "" }));

  const viewer = VIEWERS.find((v) => v.id === viewerId);
  if (!viewer) {
    return NextResponse.json({ error: "Select who you are." }, { status: 400 });
  }

  const envKey = `DASHBOARD_PASSWORD_${viewer.id.toUpperCase()}`;
  const expected = process.env[envKey];

  if (!expected) {
    return NextResponse.json(
      { error: `${envKey} is not configured on the server.` },
      { status: 500 }
    );
  }

  if (password !== expected) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, viewer.id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
