import { NextRequest, NextResponse } from "next/server";
import { VIEWERS } from "@/lib/team";

const COOKIE_NAME = "dashboard_viewer";
const VALID_IDS = new Set(VIEWERS.map((v) => v.id));

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const viewerId = req.cookies.get(COOKIE_NAME)?.value;
  const isAuthed = Boolean(viewerId && VALID_IDS.has(viewerId));

  if (pathname.startsWith("/dashboard") && pathname !== "/dashboard/login" && !isAuthed) {
    const loginUrl = new URL("/dashboard/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
