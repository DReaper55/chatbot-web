import { NextResponse } from "next/server";
import { usersDB } from "@/app/lib/database";
import { createSession } from "@/app/lib/session";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    const user = await usersDB.validateUser(username, password);
    await createSession(user.id);
    return NextResponse.json({ message: "Login successful" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
