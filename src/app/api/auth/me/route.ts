import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { usersDB } from "@/app/lib/database";

export async function GET() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const payload = await decrypt(session);
  if (!payload) return NextResponse.json({ message: "Invalid session" }, { status: 401 });

  try {
    const user = await usersDB.getUserByUsername(payload.userId as string);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
}
