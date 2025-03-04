import { NextResponse } from "next/server";
import { usersDB } from "@/app/lib/database";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    const user = await usersDB.createUser(username, password);
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
