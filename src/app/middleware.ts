import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

//   if (!session && req.nextUrl.pathname.startsWith("/profile")) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

  return NextResponse.next();
}
