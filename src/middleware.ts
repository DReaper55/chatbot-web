import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./app/lib/session";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login
  }

  try {
    decrypt(token);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect if invalid
  }
}

// Protect specific routes
export const config = {
  matcher: ["/", "/profile/:path*"], // Protect all pages
};
