import { NextRequest, NextResponse } from "next/server";
import { sessionDB } from "@/app/lib/database";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/authOptions";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    // Fetch session on the server
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { user_id } = await params; // Extract product ID from URL

    if (!params || !user_id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Fetch userSession from database using the ID
    const userSession = await sessionDB.getUserSessions(user_id, session.user?.image);

    if (!userSession) {
      return NextResponse.json({ message: "userSession not found" }, { status: 404 });
    }

    return NextResponse.json(userSession, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  try {
    // Fetch session on the server
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await sessionDB.createSession(body, session.user?.image);
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}