import { NextResponse } from "next/server";
import { sessionDB } from "@/app/lib/database";
import { getServerSession } from "next-auth";
import authOptions from "../../../auth/[...nextauth]/authOptions";

export async function GET(
  req: Request,
  { params }: { params: { user_id: string, chat_id: string } }
) {
  try {
    const { user_id, chat_id } = params; // Extract user and session ID from URL

    if (!user_id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    if (!chat_id) {
      return NextResponse.json({ message: "Session ID is required" }, { status: 400 });
    }

    // Fetch session on the server
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch userSession from database using the ID
    const userSession = await sessionDB.getSession(user_id, chat_id, session.user?.image);

    if (!userSession) {
      return NextResponse.json({ message: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(userSession, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { user_id: string, chat_id: string } }
) {
  try {
    const { user_id, chat_id } = params; // Extract user and session ID from URL

    if (!user_id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    if (!chat_id) {
      return NextResponse.json({ message: "Session ID is required" }, { status: 400 });
    }

    // Fetch session on the server
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch userSession from database using the ID
    const res = await sessionDB.deleteSession(user_id, chat_id, session.user?.image);

    if (!res) {
      return NextResponse.json({ message: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(res, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
